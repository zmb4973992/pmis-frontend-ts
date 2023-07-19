<template>
  <div id="chart2" style="width:100%; height: calc(100vh - 179px)"/>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, reactive} from "vue";
import dayjs from "dayjs";
import {contractCumulativeIncomeApi} from "@/api/contract-cumulative-income";

const props = defineProps<{ contractId: number }>()

interface valueList {
  date: string
  value: number
}

interface chartDataFormat {
  plannedIncomeProgressList: valueList[],
  actualIncomeProgressList: valueList[],
  forecastedIncomeProgressList: valueList[],
}

const chartData = reactive<chartDataFormat>({
  plannedIncomeProgressList: [],
  actualIncomeProgressList: [],
  forecastedIncomeProgressList: [],
})

onMounted(() => {
  drawChart()
})


async function drawChart() {
  let htmlElement = document.getElementById('chart2')
  if (!htmlElement) {
    return
  }

  const res = await contractCumulativeIncomeApi.getList({
    contract_id: props.contractId,
    page_size: 0
  })
  if (res && res.data) {
    for (let item of res.data) {
      chartData.plannedIncomeProgressList.push({date: item.date, value: item.planned_income_progress})
      chartData.actualIncomeProgressList.push({date: item.date, value: item.actual_income_progress})
      chartData.forecastedIncomeProgressList.push({date: item.date, value: item.forecasted_income_progress})

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
          name: '初始计划收款进度',
          type: 'line',
          itemStyle: {color: '#1890FF'},
          lineStyle: {color: '#1890FF', type: 'dashed'},
          connectNulls: true,
          smooth: true,
          datasetIndex: 0,  //通过datasetIndex来指定dataset
          dimension: ['date', 'value']
        },
        {
          name: '实际收款进度',
          type: 'line',
          itemStyle: {color: 'red'},
          lineStyle: {color: 'red'},
          connectNulls: true,
          smooth: true,
          datasetIndex: 1,
          dimension: ['date', 'value']
        },
        {
          name: '预测收款进度',
          type: 'line',
          itemStyle: {color: 'orange'},
          lineStyle: {color: 'orange', type: 'dashed'},
          connectNulls: true,
          smooth: true,
          datasetIndex: 2,
          dimension: ['date', 'value']
        },
      ],
      dataset: [
        {source: chartData.plannedIncomeProgressList},
        {source: chartData.actualIncomeProgressList},
        {source: chartData.forecastedIncomeProgressList},
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
