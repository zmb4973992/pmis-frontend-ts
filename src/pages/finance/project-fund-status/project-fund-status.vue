<template>
  <div class="layout">
    <!--查询区域-->
    <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
            :body-style="{padding:'0 10px 10px 10px'}">
      <a-form :model="queryCondition" ref="formRef">
        <a-row :gutter="10">
          <a-col>
            <a-form-item class="query-item" label="项目名称" name="projectID">
              <a-select placeholder="项目名称" show-search allow-clear
                        :filter-option="projectFilterOption"
                        v-model:value="queryCondition.projectID"
                        :options="projectOptions"
                        style="width:170px"/>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item class="query-item" label="数据类型" name="dataType">
              <a-select placeholder="数据类型" show-search allow-clear
                        :filter-option="projectFilterOption"
                        v-model:value="queryCondition.dataType"
                        :options="dataTypeOptions"
                        style="width:140px"/>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item class="query-item">
              <a-button-group>
                <a-button class="button" type="primary" @click="query">
                  <template #icon>
                    <SearchOutlined/>
                  </template>
                  查询
                </a-button>
                <a-button class="button" @click="resetQueryCondition">
                  <template #icon>
                    <RedoOutlined/>
                  </template>
                  重置
                </a-button>
              </a-button-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!--图表-->
    <a-card size="small" :bordered="false">
      <div id="chart" style="width:100%; height: calc(100vh - 140px)"/>
    </a-card>

  </div>

</template>

<script setup lang="ts">
import {FormInstance, message} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {projectApi} from "@/api/project";
import dayjs, {Dayjs} from "dayjs";
import * as echarts from 'echarts';
import useGlobalStore from "@/store/global";
import {storeToRefs} from "pinia";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {progressApi} from "@/api/progress";
import {projectCumulativeIncomeApi} from "@/api/project-cumulative-income";
import {projectCumulativeExpenditureApi} from "@/api/project-cumulative-expenditure";

//项目选择框的过滤器
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

function toBeCompleted() {
  message.info('待完成')
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

const dataTypeOptions = ref<{ value: string; label: string }[]>([
  {value: '收款进度', label: '收款进度'},
  {value: '现金流曲线', label: '现金流曲线'},
])

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
  projectID?: number
  dataType?: string

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
  actualIncomeProgress: progressList[], //实际收款进度
  actualWorkProgress: progressList[], //实际工作进度

  totalActualIncome: progressList[],//实际收款总额
  totalActualExpenditure: progressList[], //实际付款总额
}

let chartData = reactive<chartDataFormat>({
  actualIncomeProgress: [],
  actualWorkProgress: [],

  totalActualIncome: [],
  totalActualExpenditure: [],
})

async function loadChartData(projectID: number, dataType: string) {
  chartData.actualIncomeProgress = []
  chartData.actualWorkProgress = []

  chartData.totalActualIncome = []
  chartData.totalActualExpenditure = []

  switch (dataType) {
    case '收款进度':
      const res1 = await projectCumulativeIncomeApi.getList({project_id: projectID, page_size: 0})
      if (res1?.code === 0) {
        for (let item of res1.data) {
          if (item.actual_income_progress) {
            chartData.actualIncomeProgress.push({date: item.date, value: item.actual_income_progress})
          }
        }
      }

      const res2 = await progressApi.getList({project_id: projectID, type_name: "实际进度"})
      if (res2?.code === 0) {
        for (let item of res2.data) {
          chartData.actualWorkProgress.push({date: item.date, value: item.value})
        }
      }
      drawChart(dataType)
      break

    case '现金流曲线':
      const res3 = await projectCumulativeIncomeApi.getList({project_id: projectID, page_size: 0})
      if (res3?.code === 0) {
        for (let item of res3.data) {
          if (item.total_actual_income) {
            chartData.totalActualIncome.push({date: item.date, value: item.total_actual_income})
          }
        }
      }

      const res4 = await projectCumulativeExpenditureApi.getList({project_id: projectID, page_size: 0})
      if (res4?.code === 0) {
        for (let item of res4.data) {
          if (item.total_actual_expenditure) {
            chartData.totalActualExpenditure.push({date: item.date, value: item.total_actual_expenditure})
          }
        }
      }

      drawChart(dataType)
      break
  }
}

function resetChartData() {
  message.info('图表数据已重置，具体逻辑没完成', 3)
}

//声明form表单，便于使用form相关的函数。这里的变量名要跟form表单的ref保持一致
const formRef = ref<FormInstance>();

//查询按钮
function query() {
  //所有查询都从第一页开始
  queryCondition.page = 1
  if (!queryCondition.projectID || !queryCondition.dataType) {
    message.info('请选择项目名称和数据类型', 3)
    return
  }
  console.log(queryCondition.projectID)
  loadChartData(queryCondition.projectID, queryCondition.dataType)
  console.log(chartData.totalActualExpenditure);
}

//重置查询条件
function resetQueryCondition() {
  //使用resetFields时，要确保相关的a-form-item都添加了name属性
  //同时name的值要等于reactive数据的字段名，这样form的函数才能找到相关字段
  formRef.value?.resetFields()
  queryCondition.page = 1
  queryCondition.pageSize = 12
  initChart()
}

onMounted(() => initChart())


function initChart() {
  let htmlElement = document.getElementById('chart')
  if (!htmlElement) {
    return
  }

  //为了避免重复挂载echarts实例
  try {
    echarts.dispose(htmlElement)
  } catch (e) {
    console.log(e);
  }

  let myChart = echarts.init(htmlElement)
  if (myChart) {
    myChart.setOption(
        {
          title: {  //标题
            show: true,
            text: '请先选择项目名称和数据类型',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#adadad',
              fontSize: 26,
              fontWeight: 'normal',
            },
          },
        }
    )
  }
}


function drawChart(dataType: string) {
  let htmlElement = document.getElementById('chart')
  if (!htmlElement) {
    return
  }

  //为了避免重复挂载echarts实例
  try {
    echarts.dispose(htmlElement)
  } catch (e) {
    console.log(e);
  }

  let myChart = echarts.init(htmlElement)
  if (myChart) {
    switch (dataType) {
      case '收款进度':
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
              name: '实际收款进度',
              type: 'line',
              itemStyle: {color: '#1890FF'},
              lineStyle: {color: '#1890FF', type: 'dashed'},
              connectNulls: true,
              smooth: true,
              datasetIndex: 0,  //通过datasetIndex来指定dataset
              dimension: ['date', 'value']
            },
            {
              name: '实际工作进度',
              type: 'line',
              itemStyle: {color: 'red'},
              lineStyle: {color: 'red'},
              connectNulls: true,
              smooth: true,
              datasetIndex: 1,
              dimension: ['date', 'value']
            },
          ],
          dataset: [
            {source: chartData.actualIncomeProgress},
            {source: chartData.actualWorkProgress},
          ],
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
        break
      case '现金流曲线':
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
            // valueFormatter: (value: any) => (value * 100).toFixed(1) + '%',
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
            // axisLabel: {
            //   formatter: (value: any) => (value * 100).toFixed(0) + '%',
            // },
          },
          series: [
            {
              name: '实际收款总额(CNY)',
              type: 'line',
              itemStyle: {color: '#1890FF'},
              lineStyle: {color: '#1890FF', type: 'dashed'},
              connectNulls: true,
              smooth: true,
              datasetIndex: 0,  //通过datasetIndex来指定dataset
              dimension: ['date', 'value']
            },
            {
              name: '实际付款总额(CNY)',
              type: 'line',
              itemStyle: {color: 'red'},
              lineStyle: {color: 'red'},
              connectNulls: true,
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
        break
    }
  }

  window.addEventListener('resize', () => myChart.resize())
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
//查询区域每一项的样式
.query-item {
  margin: {
    top: 10px;
    bottom: 0;
  }
}

</style>

