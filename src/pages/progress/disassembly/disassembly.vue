<template>
    <div class="layout1">
        <a-row type="flex">
            <!--左侧内容区-->
            <a-col flex="280px" class="left-column">
                <a-card size="small" :bordered="false">
                    <div class="label-and-selector" style="display: flex">
                        <a-select class="project-selector" show-search placeholder="请选择项目"
                                  :filter-option="projectFilterOption" v-model:value="projectID"
                                  :options="projectOptions">
                        </a-select>
                    </div>

                    <a-divider style="margin-top: 14px;margin-bottom: 14px"/>

                    <a-tree class="tree1" v-if="treeData?.length" :tree-data="treeData"
                            v-model:selectedKeys="disassemblyIDs" :default-expand-all="true">
                        <template #title="{title,key,level}">
          <span class="title">
            <span>{{ title }}</span>
              <a @click.stop="showModalForCreatingDisassembly(key)">
                <a-tooltip>
                    <template #title>添加下级</template>
                  <PlusOutlined class="button"/>
                    </a-tooltip>
              </a>
              <a v-if="level !== 1" @click.stop="showModalForUpdatingDisassembly(key)">
                <a-tooltip>
                    <template #title>修改本项</template>
                  <EditOutlined class="button"/>
                </a-tooltip>

              </a>
              <a v-if="level !== 1" @click.stop="showModalForDeletingDisassembly(key)">
                  <a-tooltip>
                      <template #title>删除本项</template>
                  <DeleteOutlined class="button"/>
                  </a-tooltip>

              </a>
          </span>
                        </template>
                    </a-tree>
                </a-card>
            </a-col>

            <!--这是分割线gutter-->
            <a-col flex="10px"></a-col>

            <!--右侧内容区-->
            <a-col flex="auto" class="right-column">
                <a-card size="small">
                    <div class="table-buttons-row">
                        <a-space>
                            下级数据：
                            <a-button v-if="projectID" size="small" type="primary"
                                      @click="showModalForCreatingDisassembly(disassemblyIDs[0])">
                                <template #icon>
                                    <PlusOutlined/>
                                </template>
                                添加
                            </a-button>

                            <a-button v-else size="small" type="primary" disabled
                                      @click="showModalForCreatingDisassembly(disassemblyIDs[0])">
                                <template #icon>
                                    <PlusOutlined/>
                                </template>
                                添加
                            </a-button>
                            <!--              <a-button v-else size="small" type="primary" disabled>-->
                            <!--                <template #icon>-->
                            <!--                  <PlusOutlined/>-->
                            <!--                </template>-->
                            <!--                添加-->
                            <!--              </a-button>-->
                        </a-space>
                        <div class="buttons-for-table-setting">
                            <a-tooltip title="设置列" size="small">
                                <a-button type="text" @click="toBeCompleted" size="small">
                                    <template #icon>
                                        <setting-outlined style="font-size: 16px"/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </div>
                    </div>

                    <a-table :data-source="tableData.list" :columns="columns"
                             size="small" :pagination="false">
                        <template #bodyCell="{column,record,index}">
                            <template v-if="column.dataIndex === 'line_number'">
                                {{ index + 1 }}
                            </template>
                            <template v-else-if="column.dataIndex === 'action'">
                                <a @click="showModalForUpdatingDisassembly(record.id)">修改</a>
                                <a-divider type="vertical"/>
                                <a @click="showModalForDeletingDisassembly(record.id)" style="color: red">删除</a>
                            </template>
                        </template>
                    </a-table>

                    <!--分页器-->
                    <a-pagination id="paginator" v-model:pageSize="queryCondition.page_size"
                                  :total="tableData.numberOfRecords" showSizeChanger
                                  :pageSizeOptions="pageSizeOptions"
                                  showQuickJumper @change="paginationChange"
                                  :show-total="total=>`共${total}条记录`"/>

                </a-card>
            </a-col>
        </a-row>
    </div>

  <!--添加子项目的模态框-->
    <modal-for-creating-subitems
            ref="modalForCreatingSubitems" @loadData="loadData" :projectID="projectID"/>
  <!--修改单项的模态框-->
    <modal-for-updating-subitem
            ref="modalForUpdatingItem" @loadData="loadData"/>
  <!--删除单项的模态框-->
    <modal-for-deleting-item
            ref="modalForDeletingItem" @loadData="loadData"/>
</template>

<script setup lang="ts">
import ModalForCreatingSubitems from "@/pages/progress/disassembly/component/modal-for-creating-inferiors.vue";
import ModalForUpdatingSubitem from "@/pages/progress/disassembly/component/modal-for-updating-inferiors.vue";
import ModalForDeletingItem from "@/pages/progress/disassembly/component/modal-for-deleting-item.vue";
import {message} from "ant-design-vue";
import {reactive, ref, watch} from "vue";
import {PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";
import {localStorageItemName} from "@/utils/routeName";

let tableData = reactive({list: [], numberOfPages: 1, numberOfRecords: 0,})

let columns = ref([
    {
        title: '行号',
        dataIndex: 'line_number',
        className: 'line_number',
        width: '60px',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '名称',
        dataIndex: 'name',
        className: 'name',
        width: '50%',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '权重',
        dataIndex: 'weight',
        className: 'weight',
        width: '20%',
        align: 'center',
    },
    {
        title: '操作',
        className: 'action',
        dataIndex: 'action',
        width: '150px',
        ellipsis: true,
        align: 'center',
    },
])

//用于创建子项的模态框
const modalForCreatingSubitems = ref()

function showModalForCreatingDisassembly(superiorID: number | undefined) {
    modalForCreatingSubitems.value.showModal(superiorID)
}

//用于修改选中项的模态框
const modalForUpdatingItem = ref()

function showModalForUpdatingDisassembly(disassemblyID: number) {
    modalForUpdatingItem.value.showModal(disassemblyID)
}

//用于删除选中项的模态框
const modalForDeletingItem = ref()

function showModalForDeletingDisassembly(disassemblyID: number) {
    modalForDeletingItem.value.showModal(disassemblyID)
}

//项目选择框的过滤器
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

let projectID = ref<number>()
watch(projectID, () => {
    localStorage.setItem(localStorageItemName.projectIDForDisassembly, String(projectID.value))
    loadTreeData().then(() => {
        disassemblyIDs.value = []
        disassemblyIDs.value.push(treeData.value[0].key)
    })
})

function toBeCompleted() {
    message.info('待完成')
}

const projectOptions = ref<{ value: number; label: string }[]>([])

//树形图相关的数据
interface treeDataFormat {
    title: string
    key: number
    level: number
    children: treeDataFormat[] | null
}

let treeData = ref<treeDataFormat[]>([])

async function loadTreeData() {
    //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
    treeData.value = []
    if (projectID.value) {
        let res = await disassemblyApi.getTree({project_id: projectID.value})
        if (res.data) {
            for (let index in res.data) {
                treeData.value.push(switchToTreeData(res.data[index]))
            }
        }
    }
}

interface rawTreeDataFormat {
    name: string
    id: number
    level: number
    children?: rawTreeDataFormat[] | null
}

//后端返回的结果为：[{name:xxx,id:xxx,children:xxx}]，需要修改字段名称
function switchToTreeData(obj: rawTreeDataFormat): treeDataFormat {
    return {
        title: obj.name,
        key: obj.id,
        level: obj.level,
        children: obj.children?.map(child => switchToTreeData(child)) || null
    }
}

const disassemblyIDs = ref<number[]>([]);
watch(disassemblyIDs, () => {
    loadTableData()
});

async function loadTableData() {
    //如果选择了拆解id
    if (disassemblyIDs.value.length > 0) {
        let res = await disassemblyApi.getList({
            superior_id: disassemblyIDs.value[0],
            page_size: queryCondition.page_size,
            page: queryCondition.page,
        })
        if (res && res.data) {
            for (let item of res.data) {
                item.weight = (item.weight * 100).toFixed(1) + '%'
            }
            tableData.list = res?.data
            tableData.numberOfPages = res?.paging?.number_of_pages
            tableData.numberOfRecords = res?.paging?.number_of_records
        } else {
            tableData.list = []
        }
    } else {
        tableData.list = []
    }
}

function loadData() {
    loadTreeData().then(loadTableData)
}

//获取项目下拉框的选项
async function loadProjectOptions() {
    let res = await projectApi.getList({page_size: 0})
    for (let item of res.data) {
        projectOptions.value.push({label: item.name, value: item.id})
    }
}

//加载本地存储的数据
function loadLocalStorage() {
    const tempProjectID = Number(localStorage.getItem(localStorageItemName.projectIDForDisassembly))
    if (tempProjectID > 0) {
        projectID.value = tempProjectID
    }
}

loadProjectOptions().then(loadLocalStorage).then(tipsForSelectingProject)

//查询条件
const queryCondition = reactive({
    page: 1,
    page_size: 12,
    order_by: "",
    desc: false,
})

//分页器选项
const pageSizeOptions = ['12', '20', '25', '30']

//页码变化时的回调函数
const paginationChange = (page: number, pageSize: number) => {
    queryCondition.page = page
    queryCondition.page_size = pageSize
    loadTableData()
}

function tipsForSelectingProject() {
    if (!projectID.value) {
        message.info('您没有选择项目，请先在左侧选择项目', 5)
    }
}

</script>

<style scoped lang="scss">
.layout1 {
  overflow-x: auto;

  .left-column {
    background-color: white;
    height: calc(100vh - 55px);

    :deep(.ant-tree) {
      height: calc(100vh - 141px);
      width: 255px;
      overflow: auto;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    &:hover {
      ::-webkit-scrollbar {
        display: block;
      }
    }
  }
}

.right-column {
  //这个宽度必须有！
  //由于right-column是grid模式，如果在没有宽度、且column设置了ellipsis=true的情况下，表格会另起一行
  //这里的宽度值任意填，不会影响布局，只是告诉table有宽度而已
  width: 10px;

  .table-buttons-row {
    height: 35px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}


//鼠标移入节点时，显示相关操作
:deep(.ant-tree) {
  .ant-tree-treenode:hover {
    .button {
      display: inline;
    }
  }

  .ant-tree-indent-unit {
    width: 1em;
  }

  .ant-tree-switcher {
    width: 10px;
  }

  .ant-tree-title {
    word-break: break-all;
  }
}


.title {
  .button {
    display: none;
    margin-left: 6px;
  }
}

#paginator {
  margin-top: 10px;
  text-align: right;

  :deep(.ant-select-item-option) {
    text-align: center;
  }
}

.label-and-selector {
  align-items: center;

  .project-selector {
    flex: 1;
  }
}

</style>

