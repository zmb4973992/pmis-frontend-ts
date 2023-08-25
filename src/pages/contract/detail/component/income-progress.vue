<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
    <div v-if="loading"></div>
    <div v-else-if="dataExisted" id="chart3" style="width:100%; height: calc(100vh - 179px)"/>
    <a-empty v-else>
      <template #description>
        暂无收款进度的数据，看看别的吧~
      </template>
    </a-empty>
  </a-spin>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, reactive, ref} from "vue";
import dayjs from "dayjs";
import {contractDailyAndCumulativeIncomeApi} from "@/api/contract-daily-and-cumulative-income";

const props = defineProps<{ contractId: number }>()

const loading = ref(true)
const dataExisted = ref(false)

interface valueList {
  date: string
  value: number
}

interface chartDataFormat {
  plannedIncomeProgressList: valueList[],
  forecastedIncomeProgressList: valueList[],
  actualIncomeProgressList: valueList[],
}

const chartData = reactive<chartDataFormat>({
  plannedIncomeProgressList: [],
  forecastedIncomeProgressList: [],
  actualIncomeProgressList: [],
})

async function loadData() {
  try {
    const res = await contractDailyAndCumulativeIncomeApi.getList({
      contract_id: props.contractId,
      page_size: 0
    })
    if (res?.code === 0) {
      for (let item of res.data) {
        if (item.planned_income_progress) {
          chartData.plannedIncomeProgressList.push({date: item.date, value: item.planned_income_progress})
        }
        if (item.forecasted_income_progress) {
          chartData.forecastedIncomeProgressList.push({date: item.date, value: item.forecasted_income_progress})
        }
        if (item.actual_income_progress) {
          chartData.actualIncomeProgressList.push({date: item.date, value: item.actual_income_progress})
        }
      }
    } else {
      console.log(res.message)
    }

    if (chartData.plannedIncomeProgressList.length > 0 ||
        chartData.forecastedIncomeProgressList.length > 0 ||
        chartData.actualIncomeProgressList.length > 0) {
      dataExisted.value = true
    }
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false
  }
}

async function drawChart() {
  let htmlElement = document.getElementById('chart3')
  if (!htmlElement) {
    return
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
          name: '预测收款进度',
          type: 'line',
          itemStyle: {color: 'orange'},
          lineStyle: {color: 'orange', type: 'dashed'},
          connectNulls: true,
          smooth: true,
          datasetIndex: 1,
          dimension: ['date', 'value']
        },
        {
          name: '实际收款进度',
          type: 'line',
          itemStyle: {color: 'red'},
          lineStyle: {color: 'red'},
          connectNulls: true,
          smooth: true,
          datasetIndex: 2,
          dimension: ['date', 'value']
        },
      ],
      dataset: [
        {source: chartData.plannedIncomeProgressList},
        {source: chartData.forecastedIncomeProgressList},
        {source: chartData.actualIncomeProgressList},
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
        {
          type: 'inside',
          minValueSpan: 1000 * 3600 * 24 * 10, // 窗口范围的最小值，10天
        },
      ],
    })
    window.addEventListener('resize', () => myChart.resize())
  }
}

loadData().then(drawChart)

</script>

<style scoped lang="scss">

</style>
