<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
    <div v-if="loading" style="width:100%; height: calc(100vh - 323px)"></div>
    <div v-else-if="dataExisted" id="chart1" style="width:100%; height: calc(100vh - 179px)"/>
    <a-empty v-else>
      <template #description>
        暂无工作进度的数据，看看别的吧~
      </template>
    </a-empty>
  </a-spin>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {reactive, ref} from "vue";
import dayjs from "dayjs";
import {progressApi} from "@/api/progress";

const props = defineProps<{ projectId: number }>()

const loading = ref(true)
const dataExisted = ref(false)

interface valueList {
  date: string
  value: number
}

interface chartDataFormat {
  plannedProgressList: valueList[],
  forecastedProgressList: valueList[],
  actualProgressList: valueList[],
}

const chartData = reactive<chartDataFormat>({
  plannedProgressList: [],
  forecastedProgressList: [],
  actualProgressList: [],
})

async function loadData() {
  try {
    const res = await progressApi.getList({
      project_id: props.projectId,
      page_size: 0
    })

    if (res?.code === 0) {
      for (let item of res.data) {
        if (item?.type?.name === "计划进度") {
          chartData.plannedProgressList.push({date: item.date, value: item.value})
        } else if (item?.type?.name === "预测进度") {
          chartData.forecastedProgressList.push({date: item.date, value: item.value})
        } else if (item?.type?.name === "实际进度") {
          chartData.actualProgressList.push({date: item.date, value: item.value})
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
  let htmlElement = document.getElementById('chart1')
  if (!htmlElement) {
    return
  }

  let myChart = echarts.init(htmlElement)
  if (myChart) {
    myChart.setOption({
      // title: {  //标题
      //   show: true,
      //   text: '暂时没有数据，\n\n请先在左侧选择一个项目',
      //   left: 'center',
      //   top: 'center',
      //   textStyle: {
      //     color: '#adadad',
      //     fontSize: 26,
      //     fontWeight: 'normal',
      //   },
      // },
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
      dataset: [
        {source: chartData.plannedProgressList},
        {source: chartData.forecastedProgressList},
        {source: chartData.actualProgressList},
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
