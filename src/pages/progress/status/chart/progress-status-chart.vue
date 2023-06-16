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
                <div id="chart" style="width:100%; height: calc(100vh - 79px)"/>
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
import ModalForCreatingProgress from "@/pages/progress/status/table/component/modal-for-creating-progress.vue";
import ModalForUpdatingProgress from "@/pages/progress/status/table/component/modal-for-updating-progress.vue";
import ModalForDeletingProgress from "@/pages/progress/status/table/component/modal-for-deleting-progress.vue";
import {message} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";
import {progressApi} from "@/api/progress";
import {dictionaryDetailApi} from "@/api/dictionary-item";
import dayjs, {Dayjs} from "dayjs";
import * as echarts from 'echarts';
import useGlobalStore from "@/store/global";
import {storeToRefs} from "pinia";

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

interface progressList {
    date: string
    value: number
}

interface chartDataFormat {
    plannedProgressList: progressList[],
    actualProgressList: progressList[],
    predictedProgressList: progressList[],
}

let chartData = reactive<chartDataFormat>({
    plannedProgressList: [],
    actualProgressList: [],
    predictedProgressList: [],
})

async function loadChartData() {
    chartData.plannedProgressList = []
    chartData.actualProgressList = []
    chartData.predictedProgressList = []
    let myChart = echarts.getInstanceByDom(document.getElementById('chart') as HTMLElement)
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
            for (let item of res.data) {
                if (item?.type?.name === "计划进度") {
                    chartData.plannedProgressList.push({date: item.date, value: item.value})
                } else if (item?.type?.name === "实际进度") {
                    chartData.actualProgressList.push({date: item.date, value: item.value})
                } else if (item?.type?.name === "预测进度") {
                    chartData.predictedProgressList.push({date: item.date, value: item.value})
                }
            }
        }
    }
    myChart?.setOption({
        dataset: [{source: chartData.plannedProgressList},
            {source: chartData.actualProgressList},
            {source: chartData.predictedProgressList}]
    })

    //如果没有图表的数据
    if (chartData.plannedProgressList.length == 0 &&
        chartData.actualProgressList.length == 0 &&
        chartData.predictedProgressList.length == 0) {
        myChart?.setOption({
            title: {
                show: true,
                text: '暂时没有数据，\n\n请看看其他的吧~',
            }
        })
    } else {
        myChart?.setOption({
            title: {
                show: false,
                // text:'暂时没有数据，\n\n请看看其他的吧~',
            },
        })
    }
}

//获取进度类型的选项
const progressTypeOptions = ref<{ value: number; label: string }[]>([])
dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: '进度类型'}).then(
    res => {
        for (let item of res.data) {
            progressTypeOptions.value.push({value: item.id, label: item.name})
        }
    }
)

//获取数据来源的选项
const dataSourceOptions = ref<{ value: number; label: string }[]>([])
dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: '进度的数据来源'}).then(
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

onMounted(() => {
    drawChart()
})

function drawChart() {
    let htmlElement = document.getElementById('chart')
    if (!htmlElement) {
        return
    }
    let myChart = echarts.init(htmlElement)
    if (myChart) {
        myChart.setOption({
            title: {  //标题
                show: true,
                text: '暂时没有数据，\n\n请先在左侧选择一个项目',
                left: 'center',
                top: 'center',
                textStyle: {
                    color: '#adadad',
                    fontSize: 26,
                    fontWeight: 'normal',
                },
            },
            legend: {},  //图例
            grid: {  //网格
                left: '40', //网格组件离容器左侧的距离
                right: '20',//网格组件离容器右侧的距离
                bottom: '53',//网格组件离容器底部的距离
            },
            tooltip: {  //提示框
                trigger: 'axis', //提示框的触发类型
                axisPointer: { //坐标轴指示器
                    type: 'line',
                },
                valueFormatter: (value: any) => (value * 100).toFixed(1) + '%',
            },
            toolbox: {  //图表的工具栏
                show: true,
                showTitle: true,
                itemSize: 18,
                feature: {
                    saveAsImage: {  //保存为图片
                        type: 'jpg',
                        name: '进度',
                        title: '保存为图片',
                    },
                },
            },
            xAxis: {  //x轴
                type: 'time',
                boundaryGap: false,
                axisLabel: {  //坐标轴标签
                    formatter: {
                        year: '{yyyy}/{M}/{d}',
                        month: '{yyyy}/{M}/{d}',
                        day: '{yyyy}/{M}/{d}',
                    },
                    hideOverlap: true, //隐藏重叠标签
                    rotate: 15,
                },
                axisTick: {  //坐标轴刻度
                    inside: true, //坐标轴刻度朝内
                },
            },
            yAxis: {  //y轴
                type: 'value',
                axisLabel: {
                    formatter: (value: any) => (value * 100).toFixed(0) + '%',
                },
            },
            series: [
                {
                    name: '初始计划进度',
                    type: 'line',
                    itemStyle: {color: '#1890FF'},
                    lineStyle: {color: '#1890FF', type: 'dashed'},
                    connectNull: true,
                    smooth: true,
                    datasetIndex: 0,  //通过datasetIndex来指定dataset
                    dimension: ['date', 'value']
                },
                {
                    name: '实际进度',
                    type: 'line',
                    itemStyle: {color: 'red'},
                    lineStyle: {color: 'red'},
                    connectNull: true,
                    smooth: true,
                    datasetIndex: 1,
                    dimension: ['date', 'value']
                },
                {
                    name: '预测进度',
                    type: 'line',
                    itemStyle: {color: 'orange'},
                    lineStyle: {color: 'orange', type: 'dashed'},
                    connectNull: true,
                    smooth: true,
                    datasetIndex: 2,
                    dimension: ['date', 'value']
                },
            ],
            dataset: [],
            dataZoom: [
                {
                    type: "inside",
                    minValueSpan: 1000 * 3600 * 24 * 10, // 窗口范围的最小值，10天
                },
                {
                    type: 'slider',
                    height: 20,
                    minValueSpan: 1000 * 3600 * 24 * 10, // 窗口范围的最小值，10天
                    labelFormatter: (value: any) => dayjs(value).format("YYYY/M/D"),
                    bottom: '5',
                    // left:0,
                    label: {
                        show: true
                    },
                },
            ],
        })
        window.addEventListener('resize', () => myChart.resize())
    }
}

const globalStore = useGlobalStore()
const {isCollapsed} = storeToRefs(globalStore)

//如果侧边栏收起或展开，需要重新调整图表的尺寸
watch(isCollapsed, () => {
    let myChart = echarts.getInstanceByDom(document.getElementById('chart') as HTMLElement)
    if (myChart) {
        setTimeout(myChart.resize, 300)
    }
})

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
    flex: 1;
    //width: calc(100vw - 440px);
    //max-width: calc(100vw - 440px);
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

