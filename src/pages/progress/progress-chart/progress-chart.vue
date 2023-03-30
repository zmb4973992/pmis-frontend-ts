<template>
    <div class="layout">
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
            <!--图表-->
            <a-card size="small" :bordered="false">
                <div id="chart" style="width:100%;height: calc(100vh - 79px)">
                </div>
            </a-card>
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
import ModalForCreatingProgress from "@/pages/progress/progress-list/component/modal-for-creating-progress.vue";
import ModalForUpdatingProgress from "@/pages/progress/progress-list/component/modal-for-updating-progress.vue";
import ModalForDeletingProgress from "@/pages/progress/progress-list/component/modal-for-deleting-progress.vue";
import {message} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {PlusOutlined, SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";
import {progressApi} from "@/api/progress";
import {dictionaryItemApi} from "@/api/dictionary-item";
import {Dayjs} from "dayjs";
import * as echarts from 'echarts';

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
    loadChartData()
})
;

function loadData() {
    loadTreeData()
    loadChartData()
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
    pageSize: 0,
})

let chartData = reactive({list: [], numberOfPages: 1, numberOfRecords: 0,})

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

async function loadChartData() {
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
        console.log(res.data);
        if (res && res.data) {
            //获取数据时需要重置到第一页
            queryCondition.page = 1
            for (let item of res.data) {
                item.value = (item.value * 100).toFixed(1) + '%'
            }
            chartData.list = res?.data
            chartData.numberOfPages = res?.paging?.number_of_pages
            chartData.numberOfRecords = res?.paging?.number_of_records
        } else {
            chartData.list = []
        }
    } else {
        chartData.list = []
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
    loadChartData()
}

//分页器选项
const pageSizeOptions = ['12', '20', '25', '30']

//页码变化时的回调函数
function paginationChange(page: number, pageSize: number) {
    queryCondition.page = page
    queryCondition.pageSize = pageSize
    loadChartData()
}

function tableChange(pagination: any, filter: any, sorter: any) {
    if (sorter.order) {
        queryCondition.orderBy = sorter.field
        queryCondition.desc = sorter.order === "descend"
    } else {
        queryCondition.orderBy = undefined
        queryCondition.desc = undefined
    }
    loadChartData()
    console.log(queryCondition);
}

function drawChart() {
    const myChart = echarts.init(document.getElementById('chart') as HTMLElement)
    myChart.setOption({
        title: {
            text: 'Stacked Line'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        dataSet: {
            source: [
                ['product', '2015', '2016', '2017'],
                ['Matcha Latte', 43.3, 85.8, 93.7],
                ['Milk Tea', 83.1, 73.4, 55.1],
                ['Cheese Cocoa', 86.4, 65.2, 82.5],
                ['Walnut Brownie', 72.4, 53.9, 39.1]
            ]
        },
        // series: [
        //     {
        //         name: 'Email',
        //         type: 'line',
        //         stack: 'Total',
        //         data: [120, 132, 101, 134, 90, 230, 210]
        //     },
        //     {
        //         name: 'Union Ads',
        //         type: 'line',
        //         stack: 'Total',
        //         data: [220, 182, 191, 234, 290, 330, 310]
        //     },
        //     {
        //         name: 'Video Ads',
        //         type: 'line',
        //         stack: 'Total',
        //         data: [150, 232, 201, 154, 190, 330, 410]
        //     },
        //
        // ]
    });
    window.addEventListener('resize', () => myChart.resize())

}

onMounted(drawChart)

</script>

<style scoped lang="scss">
.layout {
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
    width: calc(100vw - 440px);
    max-width: calc(100vw - 440px);
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

  .ant-select-item-option {
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

