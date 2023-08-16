<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
    <div v-if="loading" style="width:100%; height: calc(100vh - 323px)"></div>
    <div v-else-if="dataExisted" id="chart2" style="width:100%; height: calc(100vh - 179px)"/>
    <a-empty v-else>
      <template #description>
        暂无现金流的数据，看看别的吧~
      </template>
    </a-empty>
  </a-spin>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, reactive, ref} from "vue";
import dayjs from "dayjs";
import {projectDailyAndCumulativeIncomeApi} from "@/api/project-daily-and-cumulative-income";
import {projectDailyAndCumulativeExpenditureApi} from "@/api/project-daily-and-cumulative-expenditure";

const props = defineProps<{ projectId: number }>()

const loading = ref(true)
const dataExisted = ref(false)

interface valueList {
  date: string
  value: number
}

interface chartDataFormat {
  totalActualIncome: valueList[],//实际收款总额
  totalActualExpenditure: valueList[], //实际付款总额
  dailyActualIncome: valueList[], //当日实际收款金额
  dailyActualExpenditure: valueList[], //当日实际付款金额
}

const chartData = reactive<chartDataFormat>({
  totalActualIncome: [],
  totalActualExpenditure: [],
  dailyActualIncome: [],
  dailyActualExpenditure: [],
})

async function loadData() {
  try {
    const res1 = await projectDailyAndCumulativeIncomeApi.getList({
      project_id: props.projectId,
      page_size: 0
    })
    if (res1?.code === 0) {
      for (let item of res1.data) {
        if (item.total_actual_income) {
          chartData.totalActualIncome.push({date: item.date, value: item.total_actual_income})
        }
        if (item.daily_actual_income) {
          chartData.dailyActualIncome.push({date: item.date, value: item.daily_actual_income})
        }
      }
    }

    const res2 = await projectDailyAndCumulativeExpenditureApi.getList({
      project_id: props.projectId,
      page_size: 0
    })

    if (res2?.code === 0) {
      for (let item of res2.data) {
        if (item.total_actual_expenditure) {
          chartData.totalActualExpenditure.push({date: item.date, value: item.total_actual_expenditure})
        }
        if (item.daily_actual_expenditure) {
          chartData.dailyActualExpenditure.push({date: item.date, value: item.daily_actual_expenditure})
        }
      }
    }

    if (res1?.code === 0 || res2?.code === 0) {
      dataExisted.value = true
    }

  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false
  }
}

function drawChart() {
  let htmlElement = document.getElementById('chart2')
  if (!htmlElement) {
    return
  }

  let myChart = echarts.init(htmlElement)
  if (myChart) {
    myChart.setOption({
      legend: {},  //图例
      grid: {  //网格
        left: '80', //网格组件离容器左侧的距离
        right: '75',//网格组件离容器右侧的距离
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
          // inside: true, //坐标轴刻度朝内
        },
      },
      yAxis: [ //y轴
        {
          type: 'value',
          name: '累计收付款',
          nameTextStyle: {align: 'right',},
          axisLabel: {margin: 2},

        },
        {
          type: 'value',
          name: '当日收付款',
          alignTicks: true, //存在多个y轴时，用来对齐刻度
          nameTextStyle: {align: 'left',},
          axisLabel: {margin: 2},
        },
      ],
      series: [
        {
          name: '实际收款总额(CNY)',
          type: 'line',
          itemStyle: {color: '#1890FF'},
          lineStyle: {color: '#1890FF'},
          connectNull: true,
          smooth: true,
          datasetIndex: 0,  //通过datasetIndex来指定dataset
          dimension: ['date', 'value'],
          tooltip: {
            valueFormatter: function (value: any) {
              return value.toLocaleString() + ' 元';
            }
          },
        },
        {
          name: '当日收款金额(CNY)',
          type: 'bar',
          itemStyle: {color: '#0000bc'},
          yAxisIndex: 1,
          datasetIndex: 1,
          tooltip: {
            valueFormatter: function (value: any) {
              return value.toLocaleString() + ' 元';
            }
          },
        },
        {
          name: '实际付款总额(CNY)',
          type: 'line',
          itemStyle: {color: 'red'},
          lineStyle: {color: 'red'},
          connectNull: true,
          smooth: true,
          datasetIndex: 2,
          dimension: ['date', 'value'],
          tooltip: {
            valueFormatter: function (value: any) {
              return value.toLocaleString() + ' 元';
            }
          },
        },

        {
          name: '当日付款金额(CNY)',
          type: 'bar',
          itemStyle: {color: '#c10000'},
          yAxisIndex: 1,
          datasetIndex: 3,
          tooltip: {
            valueFormatter: function (value: any) {
              return value.toLocaleString() + ' 元';
            }
          },
        },
      ],
      dataset: [
        {source: chartData.totalActualIncome},
        {source: chartData.dailyActualIncome},
        {source: chartData.totalActualExpenditure},
        {source: chartData.dailyActualExpenditure},
      ],
      dataZoom: [
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
