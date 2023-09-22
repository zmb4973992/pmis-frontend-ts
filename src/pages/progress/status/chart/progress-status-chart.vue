<template>
  <div class="layout">
    <!--左侧内容区-->
    <div class="left-column">
      <a-card size="small" :bordered="false">
        <div class="label-and-selector" style="display: flex">
          <a-select class="project-selector" show-search placeholder="请选择项目"
                    :filter-option="projectFilterOption" v-model:value="queryCondition.projectID"
                    :options="projectOptions" style="width: 0"/>
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
      ref="modalForCreatingProgress" @loadData="loadData" :projectID="queryCondition.projectID"/>
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
import {message, SelectProps} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";
import {progressApi} from "@/api/progress";
import {dictionaryDetailApi} from "@/api/dictionary-detail";
import dayjs from "dayjs";
import * as echarts from 'echarts';
import useGlobalStore from "@/store/global";
import {storeToRefs} from "pinia";
import {pagingFormat} from "@/interfaces/paging-interface";

//项目的选项
const projectOptions = ref<SelectProps['options']>([])

//项目选择框的过滤器
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

//加载项目下拉框的选项
async function loadProjectOptions() {
  try {
    let res = await projectApi.getList({page_size: 0,desc:true})
    for (let item of res.data) {
      projectOptions.value?.push({label: item.name, value: item.id})
    }
  } catch (e: any) {
    console.log(e)
  }
}

//加载本地存储的数据
function loadLocalStorage() {
  const tempProjectID = Number(localStorage.getItem("project_id"))
  if (tempProjectID > 0) {
    queryCondition.projectID = tempProjectID
  }

  const tempDisassemblyID = Number(localStorage.getItem("disassembly_id"))
  if (tempDisassemblyID > 0) {
    queryCondition.disassemblyID = tempDisassemblyID
  }
}

//请用户选择项目id的提示
function tipsForSelectingProjectID() {
  if (!queryCondition.projectID) {
    message.info('您没有选择项目，请先在左侧选择项目', 5)
  }
}

//树形图数据的格式
interface treeDataFormat {
  title: string
  key: number
  level: number
  children?: treeDataFormat[]
}

//树形图数据
let treeData = ref<treeDataFormat[]>([])

//加载树形图数据
async function loadTreeData() {
  try {
    if (queryCondition.projectID) {
      //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
      treeData.value = []
      const res = await disassemblyApi.getTree({project_id: queryCondition.projectID})
      if (res.data) {
        for (let index in res.data) {
          treeData.value.push(switchToTreeData(res.data[index]))
        }
      }

    } else {
      treeData.value = []
    }
  } catch (e) {
    console.log(e)
  }
}

//从后端获取的、原始树形图数据的格式
interface rawTreeDataFormat {
  name: string
  id: number
  level: number
  children?: rawTreeDataFormat[]
}

//后端返回的结果为：[{name:xxx,id:xxx,children:xxx}]，需要修改字段名称
function switchToTreeData(obj: rawTreeDataFormat): treeDataFormat {
  return {
    title: obj.name,
    key: obj.id,
    level: obj.level,
    children: obj.children?.map(child => switchToTreeData(child))
  }
}

//用于树形图的disassemblyIDs
const selectedDisassemblyIDs = ref<number[]>([]);

//监测disassemblyIDs，将值传给查询条件
watch(selectedDisassemblyIDs, (newValue) => {
  // if (newValue) {
  //   queryCondition.disassemblyID = selectedDisassemblyIDs.value[0]
  // } else {
  //   queryCondition.disassemblyID = undefined
  // }
  queryCondition.disassemblyID = selectedDisassemblyIDs.value[0]
})

//进度类型的选项
const progressTypeOptions = ref<SelectProps['options']>([])

//加载进度类型的选项
async function loadProgressTypeOptions() {
  try {
    let res = await dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: '进度类型'})
    for (let item of res.data) {
      progressTypeOptions.value?.push({value: item.id, label: item.name})
    }
  } catch (e) {
    console.log(e);
  }
}

//数据来源的选项
const dataSourceOptions = ref<SelectProps['options']>([])

//加载数据来源的选项
async function loadDataSourceOptions() {
  try {
    let res = await dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: '进度的数据来源'})
    for (let item of res.data) {
      dataSourceOptions.value?.push({value: item.id, label: item.name})
    }
  } catch (e) {
    console.log(e);
  }
}

//加载所有的选项
function loadOptions() {
  loadProjectOptions()
      .then(loadLocalStorage)
      .then(tipsForSelectingProjectID)
  loadProgressTypeOptions()
  loadDataSourceOptions()
}

loadOptions()

//查询条件的格式
interface queryConditionFormat extends pagingFormat {
  projectID?: number
  disassemblyID?: number
  // dateGte?: string
  // dateLte?: string
  type?: number
  dataSource?: number
  dateRange?: [string, string]
}

//查询条件
const queryCondition = reactive<queryConditionFormat>({
  orderBy: "date",
  desc: true,
  pageSize: 0,
})

//监测查询条件中projectID的变化
watch(() => queryCondition.projectID, async () => {
  localStorage.setItem("project_id", String(queryCondition.projectID))
  tipsForSelectingProjectID()
  await loadTreeData()
//选完项目后，默认选择最顶层的拆解id
  let res = await disassemblyApi.getList({project_id: queryCondition.projectID})
  if (res && res.data) {
    selectedDisassemblyIDs.value = []
    selectedDisassemblyIDs.value[0] = res.data[0].id
  }
})

//监测查询条件中disassemblyID的变化
watch(() => queryCondition.disassemblyID, () => {
  localStorage.setItem("disassembly_id", String(queryCondition.disassemblyID))
  //disassemblyID变化时视为重新查询，必须将页码调整为1
  queryCondition.page = 1
  loadChartData()
})

//加载所有数据
function loadData() {
  loadTreeData().then(loadChartData)
}

function toBeCompleted() {
  message.info('待完成')
}

interface progressList {
  date: string
  value: number
}

interface chartDataFormat {
  plannedProgressList: progressList[],
  predictedProgressList: progressList[],
  actualProgressList: progressList[],
}

let chartData = reactive<chartDataFormat>({
  plannedProgressList: [],
  predictedProgressList: [],
  actualProgressList: [],
})

async function loadChartData() {
  chartData.plannedProgressList = []
  chartData.predictedProgressList = []
  chartData.actualProgressList = []
  let myChart = echarts.getInstanceByDom(document.getElementById('chart') as HTMLElement)
  //如果选择了拆解id
  if (queryCondition.disassemblyID) {
    let res = await progressApi.getList({
      disassembly_id: queryCondition.disassemblyID,
      type: queryCondition.type,
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
        } else if (item?.type?.name === "预测进度") {
          chartData.predictedProgressList.push({date: item.date, value: item.value})
        } else if (item?.type?.name === "实际进度") {
          chartData.actualProgressList.push({date: item.date, value: item.value})
        }
      }
    }
  }
  myChart?.setOption({
    dataset: [
      {source: chartData.plannedProgressList},
      {source: chartData.predictedProgressList},
      {source: chartData.actualProgressList},
    ]
  })

  //如果没有图表的数据
  if (chartData.plannedProgressList.length == 0 &&
      chartData.predictedProgressList.length == 0 &&
      chartData.actualProgressList.length == 0) {
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
      },
    })
  }
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
          name: '预测进度',
          type: 'line',
          itemStyle: {color: 'orange'},
          lineStyle: {color: 'orange', type: 'dashed'},
          connectNull: true,
          smooth: true,
          datasetIndex: 1,
          dimension: ['date', 'value']
        },
        {
          name: '实际进度',
          type: 'line',
          itemStyle: {color: 'red'},
          lineStyle: {color: 'red'},
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

