<template>
  <div id="chart2" style="width:100%; height: calc(100vh - 179px)"/>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, reactive} from "vue";
import dayjs from "dayjs";
import {cumulativeProjectIncomeAndExpenditureApi} from "@/api/cumulative-project-income-and-expenditure";
import {projectCumulativeIncomeApi} from "@/api/project-cumulative-income";
import {projectCumulativeExpenditureApi} from "@/api/project-cumulative-expenditure";

const props = defineProps<{ projectId: number }>()

interface valueList {
  date: string
  value: number
}

interface chartDataFormat {
  totalActualIncome: valueList[],//实际收款总额
  totalActualExpenditure: valueList[], //实际付款总额
}

const chartData = reactive<chartDataFormat>({
  totalActualIncome: [],
  totalActualExpenditure: [],
})

onMounted(() => {
  drawChart()
})


async function drawChart() {
  let htmlElement = document.getElementById('chart2')
  if (!htmlElement) {
    return
  }

  const res1 = await projectCumulativeIncomeApi.getList({
    project_id: props.projectId,
    page_size: 0
  })
  if (res1?.code === 0) {
    for (let item of res1.data) {
      if (item.total_actual_income) {
        chartData.totalActualIncome.push({date: item.date, value: item.total_actual_income})
      }
    }
  }

  const res2 = await projectCumulativeExpenditureApi.getList({
    project_id: props.projectId,
    page_size: 0
  })
  if (res2?.code === 0) {
    for (let item of res2.data) {
      if (item.total_actual_expenditure) {
        chartData.totalActualExpenditure.push({date: item.date, value: item.total_actual_expenditure})
      }
    }
}

let myChart = echarts.init(htmlElement)
if (myChart) {
  myChart.setOption({
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
    },
    series: [
      {
        name: '实际收款总额(CNY)',
        type: 'line',
        itemStyle: {color: '#1890FF'},
        lineStyle: {color: '#1890FF'},
        connectNull: true,
        smooth: true,
        datasetIndex: 0,  //通过datasetIndex来指定dataset
        dimension: ['date', 'value']
      },
      {
        name: '实际付款总额(CNY)',
        type: 'line',
        itemStyle: {color: 'red'},
        lineStyle: {color: 'red'},
        connectNull: true,
        smooth: true,
        datasetIndex: 1,
        dimension: ['date', 'value']
      },
    ],
    dataset: [
      {source: chartData.totalActualIncome},
      {source: chartData.totalActualExpenditure},
    ],
    dataZoom: [
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

</script>

<style scoped lang="scss">

</style>