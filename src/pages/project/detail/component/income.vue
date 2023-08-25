<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
    <div v-if="loading" style="width:100%; height: calc(100vh - 323px)"></div>
    <div v-else-if="dataExisted" id="chart3" style="width:100%; height: calc(100vh - 179px)"/>
    <a-empty v-else>
      <template #description>
        暂无收款情况的数据，看看别的吧~
      </template>
    </a-empty>
  </a-spin>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { reactive, ref} from "vue";
import dayjs from "dayjs";
import {projectDailyAndCumulativeIncomeApi} from "@/api/project-daily-and-cumulative-income";

const props = defineProps<{ projectId: number }>()

const loading = ref(true)
const dataExisted = ref(false)

interface valueList {
  date: string
  value: number
}

interface chartDataFormat {
  totalPlannedIncome: valueList[],//计划收款总额
  totalForecastedIncome: valueList[],//预测收款总额
  totalActualIncome: valueList[], //实际收款总额
}

const chartData = reactive<chartDataFormat>({
  totalPlannedIncome: [],
  totalForecastedIncome: [],
  totalActualIncome: [],
})

async function loadData() {
  try {
    const res = await projectDailyAndCumulativeIncomeApi.getList({
      project_id: props.projectId,
      page_size: 0
    })
    if (res?.code === 0) {
      for (let item of res.data) {
        if (item.total_planned_income) {
          chartData.totalPlannedIncome.push({date: item.date, value: item.total_planned_income})
        }
        if (item.total_forecasted_income) {
          chartData.totalForecastedIncome.push({date: item.date, value: item.total_forecasted_income})
        }
        if (item.total_actual_income) {
          chartData.totalActualIncome.push({date: item.date, value: item.total_actual_income})
        }
      }

      dataExisted.value = true
    }
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false
  }
}

function drawChart() {
  let htmlElement = document.getElementById('chart3')
  if (!htmlElement) {
    return
  }

  let myChart = echarts.init(htmlElement)
  if (myChart) {
    myChart.setOption({
      legend: {},  //图例
      grid: {  //网格
        left: '85', //网格组件离容器左侧的距离
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
          inside: false, //坐标轴刻度朝外
        },
      },
      yAxis: {  //y轴
        type: 'value',
      },
      series: [
        {
          name: '计划付款总额(CNY)',
          type: 'line',
          itemStyle: {color: '#1890FF'},
          lineStyle: {color: '#1890FF', type: 'dashed'},
          connectNull: true,
          smooth: true,
          datasetIndex: 0,  //通过datasetIndex来指定dataset
          dimension: ['date', 'value'],
        },
        {
          name: '预测付款总额(CNY)',
          type: 'line',
          itemStyle: {color: 'orange'},
          lineStyle: {color: 'orange', type: 'dashed'},
          connectNull: true,
          smooth: true,
          datasetIndex: 1,
          dimension: ['date', 'value']
        },
        {
          name: '实际付款总额(CNY)',
          type: 'line',
          itemStyle: {color: 'red'},
          lineStyle: {color: 'red'},
          connectNull: true,
          smooth: true,
          datasetIndex: 2,
          dimension: ['date', 'value']
        },
      ],
      dataset: [
        {source: chartData.totalPlannedIncome},
        {source: chartData.totalForecastedIncome},
        {source: chartData.totalActualIncome},
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
