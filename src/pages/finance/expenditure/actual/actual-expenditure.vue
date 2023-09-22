<template>
  <div id="layout">
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
            <a-form-item class="query-item" label="付款日期" name="dateRange">
              <a-range-picker v-model:value="queryCondition.dateRange"/>
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

    <a-card size="small" :bordered="false">
      <a-row class="table-buttons-row">
        <a-button size="small" type="primary"
                  @click="createExpenditure">
          <template #icon>
            <PlusOutlined/>
          </template>
          添加实际付款记录
        </a-button>
        <div class="buttons-for-table-setting">
          <!--          <a-tooltip title="设置列" size="small">-->
          <!--            <a-button type="text" @click="toBeCompleted" size="small">-->
          <!--              <template #icon>-->
          <!--                <setting-outlined style="font-size: 16px"/>-->
          <!--              </template>-->
          <!--            </a-button>-->
          <!--          </a-tooltip>-->
        </div>
      </a-row>

      <a-table :data-source="tableData.list" :columns="columns"
               size="small" :pagination="false" :scroll="{x:1000}"
               @change="tableChange" :loading="loading">
        <template #bodyCell="{column,record,index}">
          <template v-if="column.dataIndex === 'line_number'">
            {{ index + 1 }}
          </template>

          <template v-else-if="column.dataIndex[0] === 'project' && column.dataIndex[1] === 'name'">
            <a-tooltip v-if="record?.project?.id">
              <template #title>
                {{ record.project.name }}
              </template>
              <router-link target="_blank" :to="{name:'项目详情',params:{projectID: record.project.id}}">
                {{ record.project.name }}
              </router-link>
            </a-tooltip>
          </template>

          <template v-else-if="column.dataIndex[0] === 'contract' && column.dataIndex[1] === 'name'">
            <a-tooltip v-if="record?.contract?.id">
              <template #title>
                {{ record.contract.name }}
              </template>
              <router-link target="_blank" :to="{name:'合同详情',params:{contractID: record.contract.id}}">
                {{ record.contract.name }}
              </router-link>
            </a-tooltip>
          </template>

          <template v-else-if="column.dataIndex === 'amount'">
            {{ record.amount.toLocaleString() }}
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <!--            <a-button type="link" style="padding: 0" @click="toBeCompleted">-->
            <!--              查看-->
            <!--            </a-button>-->
            <!--            <a-divider type="vertical"/>-->
            <a-button type="link" style="padding: 0" @click="updateExpenditure">
              修改
            </a-button>
            <a-divider type="vertical"/>
            <a-tooltip placement="topLeft">
              <template #title>如需删除，请联系管理员</template>
              <a-button type="link" style="padding: 0" danger disabled
                        @click="deleteExpenditure">
                删除
              </a-button>
            </a-tooltip>
          </template>

        </template>
      </a-table>

      <!--分页器-->
      <a-pagination class="paginator" v-model:current="queryCondition.page"
                    v-model:pageSize="queryCondition.pageSize" show-less-items
                    :total="tableData.numberOfRecords" show-size-changer
                    :pageSizeOptions="pageSizeOptions" show-quick-jumper
                    @change="loadTableData" :show-total="(total:any)=>`共${total.toLocaleString()}条记录`"/>
    </a-card>
  </div>

</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue"
import {SearchOutlined, RedoOutlined, PlusOutlined} from "@ant-design/icons-vue"
import {FormInstance, message, SelectProps} from "ant-design-vue"
import {projectApi} from "@/api/project"
import {pageSizeOptions} from "@/constants/paging-constant"
import {pagingFormat} from "@/interfaces/paging-interface"
import {incomeAndExpenditureApi} from "@/api/income-and-expenditure"
import type {Dayjs} from "dayjs"
import router from "@/router";
import {useRoute} from "vue-router";
import dayjs from "dayjs";

function createExpenditure() {
  message.warn('为确保数据的一致性，信息会从OA自动同步，无需手动添加', 5)
}

function updateExpenditure() {
  message.warn('为确保数据的一致性，信息会从OA自动同步，无需手动修改', 5)
}

function deleteExpenditure() {
  message.warn('为确保数据的一致性，信息会从OA自动同步，无需手动删除', 5)
}

//查询条件
interface queryConditionFormat extends pagingFormat {
  projectID?: number
  nameInclude?: string
  dateRange?: [Dayjs, Dayjs]
}

const queryCondition = reactive<queryConditionFormat>({
  page: 1,
  pageSize: 12,
  orderBy: "date",
  desc: true,
})

//部门选项的过滤器（下拉框搜索）
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

const tableData = reactive({list: [], numberOfPages: 1, numberOfRecords: 0,})

const loading = ref(false)

const columns = ref([
  {
    title: '行号',
    dataIndex: 'line_number',
    width: '50px',
    fixed: 'left',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '金额',
    dataIndex: 'amount',
    className: 'amount',
    width: '160px',
    ellipsis: true,
    align: 'right',
    sorter: true,
  },
  {
    title: '币种',
    dataIndex: ['currency', 'name'],
    width: '120px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '日期',
    dataIndex: 'date',
    width: '120px',
    ellipsis: true,
    align: 'center',
    sorter: true,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: '200px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '合同名称',
    dataIndex: ['contract', 'name'],
    width: '260px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目名称',
    dataIndex: ['project', 'name'],
    width: '260px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '汇率',
    dataIndex: 'exchange_rate',
    width: 100,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '110px',
    fixed: 'right',
    ellipsis: true,
    align: 'center',
  },
])

//声明form表单，便于使用form相关的函数。这里的变量名要跟form表单的ref保持一致
const formRef = ref<FormInstance>();

//查询按钮
function query() {
  //所有查询都从第一页开始
  queryCondition.page = 1
  //刷新url，清空url的query参数
  router.push({name: '实际付款列表',})
  //加载表格数据
  loadTableData()
}

//重置查询条件
function resetQueryCondition() {
  //使用resetFields时，要确保相关的a-form-item都添加了name属性
  //同时name的值要等于reactive数据的字段名，这样form的函数才能找到相关字段
  formRef.value?.resetFields()
  //resetFields会把数组变为[null]，而不是空数组，所以这里需要自行重置！！！
  queryCondition.dateRange = undefined
  queryCondition.page = 1
  queryCondition.pageSize = 12
  queryCondition.projectID = undefined
  loadTableData()
}

//表格需要排序时的回调函数
function tableChange(pagination: any, filter: any, sorter: any) {
  //将页码调回到第一页，一边显示，一边查询
  queryCondition.page = 1
  if (sorter.order) {
    queryCondition.orderBy = sorter.field
    queryCondition.desc = sorter.order === "descend"
  } else {
    queryCondition.orderBy = undefined
    queryCondition.desc = undefined
  }
  loadTableData()
}

async function loadTableData() {
  try {
    loading.value = true
    let res = await incomeAndExpenditureApi.getList({
      project_id: queryCondition.projectID,
      kind: "实际",
      fund_direction: "付款",
      date_gte: queryCondition.dateRange?.length === 2 ?
          queryCondition.dateRange[0]?.format("YYYY-MM-DD") : undefined,
      date_lte: queryCondition.dateRange?.length === 2 ?
          queryCondition.dateRange[1]?.format("YYYY-MM-DD") : undefined,
      page: queryCondition.page,
      page_size: queryCondition.pageSize,
      order_by: queryCondition.orderBy,
      desc: queryCondition.desc,
    })
    if (res?.code === 0) {
      tableData.list = res?.data
      tableData.numberOfPages = res?.paging?.number_of_pages
      tableData.numberOfRecords = res?.paging?.number_of_records
    } else {
      tableData.list = []
      tableData.numberOfPages = 1
      tableData.numberOfRecords = 0
    }
  } catch (err) {
    tableData.list = []
    tableData.numberOfPages = 1
    tableData.numberOfRecords = 0
    console.log(err);
  } finally {
    loading.value = false
  }
}


const projectOptions = ref<SelectProps['options']>([])

//获取项目下拉框的选项
async function loadProjectOptions() {
  try {
    let res = await projectApi.getList({page_size: 0,desc:true})
    for (let item of res.data) {
      projectOptions.value?.push({label: item.name, value: item.id})
    }
  } catch (err) {
    console.log(err)
  }
}

//加载所有的查询选项
async function loadQueryOptions() {
  await loadProjectOptions()
}

//监测查询条件中projectID的变化
watch(() => queryCondition.projectID, (newValue: any) => {
      if (newValue > 0) {
        localStorage.setItem("project_id", String(queryCondition.projectID))
      } else {
        localStorage.removeItem("project_id")
      }
    }
)

//加载本地存储的数据
function loadLocalStorage() {
  const tempProjectID = Number(localStorage.getItem("project_id"))
  if (tempProjectID > 0) {
    queryCondition.projectID = tempProjectID
  }
}

const route = useRoute()

async function loadQueryConditionsInUrl() {
  //日期范围必须有开始日期和结束日期
  if (route?.query.start_date && route?.query.end_date) {
    queryCondition.dateRange = [dayjs(), dayjs()]
    queryCondition.dateRange[0] = dayjs(route.query.start_date as string)
    queryCondition.dateRange[1] = dayjs(route.query.end_date as string)
  }
}

//先加载所有的查询选项，然后加载url里的query参数，
// 然后加载本地所有的查询条件，然后根据查询条件加载表格数据
loadQueryOptions()
    .then(() => loadQueryConditionsInUrl())
    .then(() => loadLocalStorage())
    .then(() => loadTableData())

</script>

<style scoped lang="scss">
//查询区域每一项的样式
.query-item {
  margin: {
    top: 10px;
    bottom: 0;
  }
}

//表格上方按钮行的样式
.table-buttons-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

:deep(.ant-table) {
  //滚动条整体样式
  ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  //滚动条里的滑块
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #c9c9c9;
  }

  //滚动条的轨道
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
}

//分页器的样式
.paginator {
  margin-top: 10px;
  text-align: right;

  //每页记录条数的样式
  :deep(.ant-select-item-option) {
    text-align: center;
  }
}

//表格的表头样式
:deep(.ant-table-thead) {
  > tr > th {
    text-align: center !important;
  }
}

</style>
