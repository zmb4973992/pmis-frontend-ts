<template>
    <div class="layout">
        <a-row type="flex">
            <!--左侧内容区-->
            <a-col flex="280px" class="left-column">
                <a-card size="small" :bordered="false">
                    <div class="label-and-selector">
                        <span>项目名称：</span>
                        <a-select class="project-selector" show-search placeholder="项目名称" allow-clear
                                  :filter-option="projectFilterOption" v-model:value="queryCondition.projectID"
                                  :options="projectOptions">
                        </a-select>
                    </div>

                    <a-divider style="margin-top: 14px;margin-bottom: 14px"/>

                    <a-tree v-if="treeData?.length" :tree-data="treeData"
                            @select="disassemblyIDsChange"
                            v-model:selectedKeys="queryCondition.disassemblyIDs" default-expand-all>
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

            <!--这是分割线-->
            <a-col flex="10px"/>

            <!--右侧内容区-->
            <a-col flex="auto" class="right-column">
                <a-card size="small" :bordered="false">
                    <a-row class="table-buttons-row">
                        <a-space>
                            <span>下级数据：</span>
                            <a-button v-if="queryCondition.projectID" size="small" type="primary"
                                      @click="showModalForCreatingDisassembly(
                                          queryCondition.disassemblyIDs ? queryCondition.disassemblyIDs[0] : undefined)">
                                <template #icon>
                                    <PlusOutlined/>
                                </template>
                                添加
                            </a-button>

                            <a-button v-else size="small" type="primary" disabled
                                      @click="showModalForCreatingDisassembly(
                                          queryCondition.disassemblyIDs ? queryCondition.disassemblyIDs[0] : undefined)">
                                <template #icon>
                                    <PlusOutlined/>
                                </template>
                                添加
                            </a-button>
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
                    </a-row>

                    <a-table :data-source="tableData.list" :columns="columns"
                             size="small" :pagination="false" @change="tableChange"
                             :loading="loading">
                        <template #bodyCell="{column,record,index}">
                            <template v-if="column.dataIndex === 'line_number'">
                                {{ index + 1 }}
                            </template>
                            <template v-else-if="column.dataIndex === 'action'">
                                <a-button type="link" style="padding: 0"
                                          @click="showModalForUpdatingDisassembly(record.id)">修改
                                </a-button>
                                <a-divider type="vertical"/>
                                <a-button type="link" style="padding: 0;color: red"
                                          @click="showModalForDeletingDisassembly(record.id)">删除
                                </a-button>
                            </template>
                        </template>
                    </a-table>

                    <!--分页器-->
                    <a-pagination class="paginator" v-model:current="queryCondition.page"
                                  v-model:pageSize="queryCondition.pageSize" show-less-items
                                  :total="tableData.numberOfRecords" show-size-changer
                                  :pageSizeOptions="pageSizeOptions" show-quick-jumper
                                  @change="loadTableData" :show-total="total=>`共${total}条记录`"/>
                </a-card>
            </a-col>
        </a-row>
    </div>

  <!--添加子项目的模态框-->
    <modal-for-creating-subitems
            ref="modalForCreatingSubitems" @loadData="loadData" :projectID="queryCondition.projectID"/>
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
import {message, SelectProps} from "ant-design-vue";
import {reactive, ref, watch} from "vue";
import {PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";
import {pagingFormat} from "@/interfaces/paging-interface";
import {projectIDForDisassembly} from "@/constants/disassembly-constant";
import {pageSizeOptions} from "@/constants/paging-constant";

//查询条件
interface queryConditionFormat extends pagingFormat {
    projectID?: number
    disassemblyIDs?: number[] //受tree组件限制，必须为数组
    disassemblyID?: number
}

const queryCondition = reactive<queryConditionFormat>({
    page: 1,
    pageSize: 12,
})

function disassemblyIDsChange(selectedKeys: any, e: {
    selected: boolean, selectedNodes: any, node: any, event: any
}) {
    console.log(selectedKeys);
    console.log(e.selectedNodes);
    console.log(e.node);
    console.log(e.event);
}

let tableData = reactive({list: [], numberOfPages: 1, numberOfRecords: 0,})

const loading = ref(false)

let columns = ref([
    {
        title: '行号',
        dataIndex: 'line_number',
        width: '60px',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '名称',
        dataIndex: 'name',
        width: '50%',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '权重',
        dataIndex: 'weight',
        width: '20%',
        align: 'center',
    },
    {
        title: '操作',
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

watch(() => queryCondition.projectID, () => {
    localStorage.setItem(projectIDForDisassembly, String(queryCondition.projectID))
    tipsForSelectingProject()
    loadTreeData().then(() => {
        queryCondition.disassemblyIDs = []
        queryCondition.disassemblyIDs.push(treeData.value[0].key)
    })
})

watch(() => queryCondition.disassemblyIDs, () => {
    loadTableData()
});

function toBeCompleted() {
    message.info('待完成')
}

const projectOptions = ref<SelectProps['options']>()

//树形图相关的数据
interface treeDataFormat {
    title: string
    key: number
    level: number
    children?: treeDataFormat[]
}

let treeData = ref<treeDataFormat[]>([])

async function loadTreeData() {
    try {
        //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
        treeData.value = []
        if (queryCondition.projectID) {
            let res = await disassemblyApi.getTree({project_id: queryCondition.projectID})
            if (res.data) {
                for (let index in res.data) {
                    treeData.value.push(switchToTreeData(res.data[index]))
                }
            }
        }
    } catch (err) {
        console.log(err);
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
        children: obj.children?.map(child => switchToTreeData(child)) || undefined
    }
}

//表格需要排序时的回调函数
function tableChange(pagination: any, filter: any, sorter: any) {
    //将页码调回到第一页，一边显示，一边查询
    queryCondition.page = 1
    if (sorter.order) {
        queryCondition.orderBy = sorter.field
        queryCondition.desc = sorter.order === "descend"
    } else {
        queryCondition.orderBy = undefined
        queryCondition.desc = undefined
    }
    loadTableData()
}

async function loadTableData() {
    //如果选择了拆解id
    if (queryCondition.disassemblyIDs && queryCondition.disassemblyIDs.length > 0) {
        let res = await disassemblyApi.getList({
            superior_id: queryCondition.disassemblyIDs[0],
            page_size: queryCondition.pageSize,
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
    try {
        let res = await projectApi.getList({page_size: 0})
        console.log(res);
        projectOptions.value = []
        for (let item of res.data) {
            projectOptions.value.push({label: item.name, value: item.id})
        }
    } catch (err) {
        console.log(err)
    }
}

//加载本地存储的数据
function loadLocalStorage() {
    const tempProjectID = Number(localStorage.getItem(projectIDForDisassembly))
    if (tempProjectID > 0) {
        queryCondition.projectID = tempProjectID
    }
}

loadProjectOptions().then(loadLocalStorage).then(tipsForSelectingProject)

function tipsForSelectingProject() {
    if (!queryCondition.projectID) {
        message.info('您没有选择项目，请先在左侧选择项目', 5)
    }
}

</script>

<style scoped lang="scss">
.layout {
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

  .right-column {
    //这个宽度必须有！
    //由于right-column是grid模式，如果在没有宽度、且column设置了ellipsis=true的情况下，表格会另起一行
    //这里的宽度值任意填，不会影响布局，只是告诉table有宽度而已
    width: 10px;

    //表格上方按钮行的样式
    .table-buttons-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
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

.paginator {
  margin-top: 10px;
  text-align: right;

  :deep(.ant-select-item-option) {
    text-align: center;
  }
}

.label-and-selector {
  display: flex;
  align-items: center;

  .project-selector {
    flex: 1;
  }
}

//表格的表头样式
:deep(.ant-table-thead) {
  > tr > th {
    text-align: center !important;
  }
}

</style>

