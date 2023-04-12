<template>
    <div id="layout">
        <!--左侧内容区-->
        <div class="left-column">
            <a-card size="small" :bordered="false">
                <div class="label-and-selector" style="display: flex">
                    <a-select class="project-selector" show-search placeholder="请选择项目"
                              :filter-option="projectFilterOption" v-model:value="projectID"
                              :options="projectOptions"/>
                </div>

                <a-divider style="margin-top: 14px;margin-bottom: 14px"/>

                <a-tree v-if="treeData?.length" :tree-data="treeData"
                        v-model:selectedKeys="selectedDisassemblyIDs" :default-expand-all="true"/>
            </a-card>

        </div>

        <!--右侧内容区-->
        <div class="right-column">
            <!--搜索框-->
            <a-card size="small" :bordered="false" style="margin-bottom: 10px">
                <!--id不能删，需要通过id获取组件的高度，从而给下面的表格调整高度-->
                <a-row :gutter="10" id="query-row">
                    <a-col>
                        <span>进度类型：</span>
                        <a-select ref="progressType" placeholder="进度类型"
                                  v-model:value="queryCondition.type" :options="progressTypeOptions"
                                  style="width:130px"/>
                    </a-col>
                    <a-col>
                        <span>数据来源：</span>
                        <a-select ref="dataSource" placeholder="数据来源"
                                  v-model:value="queryCondition.dataSource" :options="dataSourceOptions"
                                  style="width:130px"/>
                    </a-col>

                    <a-col>
                        <span>日期范围：</span>
                        <a-range-picker v-model:value="dateRange"/>
                    </a-col>
                    <a-col>
                        <a-button-group>
                            <a-button class="button" type="primary" @click="loadTableData">
                                <template #icon>
                                    <SearchOutlined/>
                                </template>
                                查询
                            </a-button>
                            <a-button class="button" @click="reset">
                                <template #icon>
                                    <RedoOutlined/>
                                </template>
                                重置
                            </a-button>
                        </a-button-group>
                    </a-col>
                </a-row>
            </a-card>

            <a-card size="small" :bordered="false">
                <div class="table-buttons-row">
                    <a-space>
                        <template v-if="projectID">
                            <a-button size="small" type="primary"
                                      @click="showModalForCreatingProgress(queryCondition.disassemblyID)">
                                <template #icon>
                                    <PlusOutlined/>
                                </template>
                                添加
                            </a-button>
                        </template>
                        <template v-else>
                            <a-tooltip>
                                <template #title>
                                    先在左侧选择项目后，才能添加进度
                                </template>
                                <a-button size="small" type="primary" disabled>
                                    <template #icon>
                                        <PlusOutlined/>
                                    </template>
                                    添加
                                </a-button>
                            </a-tooltip>
                        </template>
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
                         size="small" :pagination="false" :scroll="{x:1000,y:heightOfTable}"
                         @change="tableChange">
                    <template #bodyCell="{column,record,index}">
                        <template v-if="column.dataIndex === 'line_number'">
                            {{ index + 1 }}
                        </template>
                        <template v-else-if="column.dataIndex === 'action'">
                            <template v-if="record?.data_source?.name === '系统计算'">
                                <a-tooltip>
                                    <template #title>
                                        <span>”系统计算“的数据无法修改</span>
                                    </template>
                                    <a-button type="link" disabled style="padding: 0">
                                        修改
                                    </a-button>
                                </a-tooltip>
                                <a-divider type="vertical"/>
                                <a-tooltip placement="topRight">
                                    <template #title>
                                        <span>”系统计算“的数据无法删除</span>
                                    </template>
                                    <a-button type="link" disabled style="padding: 0">
                                        删除
                                    </a-button>
                                </a-tooltip>
                            </template>
                            <template v-else>
                                <a-button type="link" style="padding: 0"
                                          @click="showModalForUpdatingProgress(record.id)">
                                    修改
                                </a-button>
                                <a-divider type="vertical"/>
                                <a-button type="link" style="padding: 0" danger
                                          @click="showModalForDeletingProgress(record.id)">
                                    删除
                                </a-button>
                            </template>
                        </template>
                        <template v-else-if="column.dataIndex[0] === 'type' && column.dataIndex[1] === 'name' ">
                            <template v-if="record.type.name === '计划进度'">
                                <span style="color:#1890ff">{{ record.type.name }}</span>
                            </template>
                            <template v-if="record.type.name === '实际进度'">
                                <span style="color:red">{{ record.type.name }}</span>
                            </template>
                            <template v-if="record.type.name === '预测进度'">
                                <span style="color:orange">{{ record.type.name }}</span>
                            </template>
                        </template>

                    </template>
                </a-table>

                <!--分页器-->
                <a-pagination id="paginator" v-model:pageSize="queryCondition.pageSize"
                              :total="tableData.numberOfRecords" showSizeChanger
                              :pageSizeOptions="pageSizeOptions"
                              showQuickJumper @change="paginationChange"
                              :show-total="total=>`共${total}条记录`"/>
            </a-card>

            {{}}

        </div>
    </div>

  <!--添加进度的模态框-->
    <modal-for-creating-progress
            ref="modalForCreatingProgress" @loadData="loadData" :projectID="projectID"/>
  <!--修改进度的模态框-->
    <modal-for-updating-progress
            ref="modalForUpdatingProgress" @loadData="loadData"/>
  <!--删除进度的模态框-->
    <modal-for-deleting-progress
            ref="modalForDeletingProgress" @loadData="loadData"/>
</template>

<script setup lang="ts">
import ModalForCreatingProgress from "@/pages/progress/status/table/component/modal-for-creating-progress.vue";
import ModalForUpdatingProgress from "@/pages/progress/status/table/component/modal-for-updating-progress.vue";
import ModalForDeletingProgress from "@/pages/progress/status/table/component/modal-for-deleting-progress.vue";
import {message} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {PlusOutlined, SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";
import {progressApi} from "@/api/progress";
import {dictionaryItemApi} from "@/api/dictionary-item";
import {Dayjs} from "dayjs";

//用于创建进度的模态框
const modalForCreatingProgress = ref()

function showModalForCreatingProgress(disassemblyID?: number) {
    modalForCreatingProgress.value.showModal(disassemblyID)
}

//用于修改进度的模态框
const modalForUpdatingProgress = ref()

function showModalForUpdatingProgress(disassemblyID: number) {
    modalForUpdatingProgress.value.showModal(disassemblyID)
}

//用于删除选进度的模态框
const modalForDeletingProgress = ref()

function showModalForDeletingProgress(disassemblyID: number) {
    modalForDeletingProgress.value.showModal(disassemblyID)
}

//项目选择框的过滤器
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

let projectID = ref()
watch(projectID, async () => {
    await loadTreeData()
    //选完项目后，默认选择最顶层的拆解id
    let res = await disassemblyApi.getList({project_id: projectID.value})
    if (res && res.data) {
        selectedDisassemblyIDs.value = []
        selectedDisassemblyIDs.value[0] = res.data[0].id
    }
})

function toBeCompleted() {
    message.info('待完成')
}

//树形图相关的数据

interface treeDataFormat {
    title: string
    key: number
    level: number
    children: treeDataFormat[] | null
}

let treeData = ref<treeDataFormat[]>([])

async function loadTreeData() {
    if (projectID.value) {
        //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
        treeData.value = []
        const res = await disassemblyApi.getTree({project_id: projectID.value})
        if (res.data) {
            for (let index in res.data) {
                treeData.value.push(switchToTreeData(res.data[index]))
            }
        }

    } else {
        treeData.value = []
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

const selectedDisassemblyIDs = ref<number[]>([]);
watch(selectedDisassemblyIDs, (newValue) => {
    if (newValue) {
        queryCondition.disassemblyID = selectedDisassemblyIDs.value[0]
    } else {
        queryCondition.disassemblyID = undefined
    }
    loadTableData()
})
;

function loadData() {
    loadTreeData()
    loadTableData()
}

const projectOptions = ref<{ value: number; label: string }[]>([])

//获取项目下拉框的选项
async function loadProjectOptions() {
    let res = await projectApi.getList({page_size: 0})
    for (let item of res.data) {
        projectOptions.value.push({label: item.name, value: item.id})
    }
}

loadProjectOptions()

const dateRange = ref<[Dayjs, Dayjs]>()
watch(dateRange, (newValue) => {
    if (newValue) {
        queryCondition.dateGte = newValue[0].format("YYYY-MM-DD")
        queryCondition.dateLte = newValue[1].format("YYYY-MM-DD")
    } else {
        queryCondition.dateGte = undefined
        queryCondition.dateLte = undefined
    }
})

//表格的查询条件
interface queryFormat {
    disassemblyID?: number
    dateGte?: string
    dateLte?: string
    type?: number
    dataSource?: number

    page?: number
    pageSize?: number
    orderBy?: string
    desc?: boolean
}

const queryCondition = reactive<queryFormat>({
    orderBy: "date",
    desc: true,
    pageSize: 12,
})


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
        title: '日期',
        dataIndex: 'date',
        className: 'date',
        width: '10%',
        ellipsis: true,
        align: 'center',
        sorter: true,
        defaultSortOrder: 'descend',
    },
    {
        title: '类型',
        dataIndex: ['type', 'name'],
        className: 'type',
        width: '120px',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '进度值',
        dataIndex: 'value',
        className: 'value',
        width: '100px',
        align: 'center',
    },
    {
        title: '数据来源',
        dataIndex: ['data_source', 'name'],
        className: 'data_source',
        align: 'center',
    },
    {
        title: '备注',
        dataIndex: 'remarks',
        className: 'remarks',
        align: 'center',
    },
    {
        title: '操作',
        className: 'action',
        dataIndex: 'action',
        width: '110px',
        ellipsis: true,
        align: 'center',
        fixed: 'right',
    },
])

async function loadTableData() {
    //如果选择了拆解id
    if (queryCondition.disassemblyID) {
        let res = await progressApi.getList({
            disassembly_id: queryCondition.disassemblyID,
            type: queryCondition.type,
            date_gte: queryCondition.dateGte,
            date_lte: queryCondition.dateLte,
            data_source: queryCondition.dataSource,
            page: queryCondition.page,
            page_size: queryCondition.pageSize,
            order_by: queryCondition.orderBy,
            desc: queryCondition.desc,
        })
        if (res && res.data) {
            //获取表格数据时需要重置到第一页
            queryCondition.page = 1
            for (let item of res.data) {
                item.value = (item.value * 100).toFixed(1) + '%'
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

//获取进度类型的选项
const progressTypeOptions = ref<{ value: number; label: string }[]>([])
dictionaryItemApi.getList({page_size: 0, dictionary_type_name: '进度类型'}).then(
    res => {
        for (let item of res.data) {
            progressTypeOptions.value.push({value: item.id, label: item.name})
        }
    }
)

//获取数据来源的选项
const dataSourceOptions = ref<{ value: number; label: string }[]>([])
dictionaryItemApi.getList({page_size: 0, dictionary_type_name: '进度的数据来源'}).then(
    res => {
        for (let item of res.data) {
            dataSourceOptions.value.push({value: item.id, label: item.name})
        }
    }
)

function reset() {
    queryCondition.dateGte = undefined
    queryCondition.dateLte = undefined
    queryCondition.type = undefined
    queryCondition.dataSource = undefined
    queryCondition.page = 1
    queryCondition.pageSize = 12
    queryCondition.orderBy = "date"
    queryCondition.desc = undefined
    loadTableData()
}

//分页器选项
const pageSizeOptions = ['12', '20', '25', '30']

//页码变化时的回调函数
function paginationChange(page: number, pageSize: number) {
    queryCondition.page = page
    queryCondition.pageSize = pageSize
    loadTableData()
}

function tableChange(pagination: any, filter: any, sorter: any) {
    if (sorter.order) {
        queryCondition.orderBy = sorter.field
        queryCondition.desc = sorter.order === "descend"
    } else {
        queryCondition.orderBy = undefined
        queryCondition.desc = undefined
    }
    loadTableData()
}


let heightOfTable = ref(300)

function modifyTableHeight() {
    let layout = document.getElementById('layout')
    let queryRow = document.getElementById('query-row')
    let paginator = document.getElementById('paginator')
    if (layout && queryRow && paginator) {
        //获取table附近影响定位的元素尺寸
        let layoutSize = layout.getBoundingClientRect()
        let queryRowSize = queryRow.getBoundingClientRect()
        let paginatorSize = paginator.getBoundingClientRect()
        heightOfTable.value = (layoutSize.height - queryRowSize.height - paginatorSize.height - 131)
    }
}

onMounted(() => {
    modifyTableHeight()
})


</script>

<style scoped lang="scss">
#layout {
  overflow-x: hidden;
  display: flex;

  .left-column {
    background-color: white;
    width: 270px;
    min-width: 270px;
    height: calc(100vh - 55px);
    margin-right: 10px;

    :deep(.ant-tree) {
      height: calc(100vh - 140px);
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
    flex: 1;
    width: 1px; //必须有，否则表格的scroll属性无法生效
    display: flex;
    flex-direction: column;

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

//每个a-col增加下边距，这样换行时上下的col不会粘在一起
.ant-col {
  margin-bottom: 10px;
}

//由于上面的a-col设置了下边距，为了最后一行不跟row的padding冲突，这里调整一下row的下边距
.ant-row {
  margin-bottom: -10px;
}

//日期选择器的宽度
.ant-picker-range {
  width: 230px;
}

</style>

