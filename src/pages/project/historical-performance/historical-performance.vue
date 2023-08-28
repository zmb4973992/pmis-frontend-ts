<template>
  <!--查询区域-->
  <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-form ref="formRef" :model="queryCondition">
      <a-row :gutter="10">
        <a-col>
          <a-form-item class="query-item" label="部门" name="organizationIDIn">
            <a-select show-search allow-clear mode="multiple" :filter-option="organizationFilterOption"
                      :max-tag-count="1" :max-tag-text-length="2" placeholder="部门"
                      v-model:value="queryCondition.organizationIDIn" :options="organizationOptions"
                      style="width:170px">
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item class="query-item" label="项目全称" name="nameInclude">
            <a-input v-model:value="queryCondition.nameInclude"
                     placeholder="支持模糊搜索" style="width: 180px"/>
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

  <!--表格主体-->
  <a-card size="small" :bordered="false">

    <a-row class="table-buttons">
      <a-row class="table-left-buttons">
      </a-row>

      <a-row class="table-right-buttons">
        <a-tooltip title="设置列" size="small">
<!--          <a-button type="text" @click="toBeCompleted" size="small">-->
<!--            <template #icon>-->
<!--              <setting-outlined style="font-size: 16px"/>-->
<!--            </template>-->
<!--          </a-button>-->
        </a-tooltip>
      </a-row>
    </a-row>

    <a-table :data-source="tableData.list" :columns="columns"
             size="small" :pagination="false" :scroll="{x:1200}"
             @change="tableChange" :loading="tableLoading">
      <template #bodyCell="{column,record,index}">
        <template v-if="column.dataIndex === 'line_number'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'name'">
          <template v-if="record?.authorized === true">
            <router-link target="_blank" :to="{
            name:'项目详情',params:{projectID: record.id}
          }">
              {{ record.name }}
            </router-link>
          </template>

          <template v-else>
            <router-link to="" :disabled="true">
              <a-tooltip>
                <template #title>
                  您没有权限查看该项目的详情
                </template>
                {{ record.name }}
              </a-tooltip>

            </router-link>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" style="padding: 0" @click="showModalForUpdating(record.id)">
            修改
          </a-button>
          <a-divider type="vertical"/>
          <a-tooltip placement="topRight">
            <template #title>如需删除，请联系管理员</template>
            <a-button type="link" style="padding: 0" danger disabled
                      @click="showModalForDeleting(record.id)">
              删除
            </a-button>
          </a-tooltip>
        </template>
        <template v-else-if="column.dataIndex === 'amount'">
          {{ record.amount.toLocaleString() }}
        </template>
      </template>
    </a-table>

    <!--分页器-->
    <a-pagination class="paginator" v-model:current="queryCondition.page"
                  v-model:pageSize="queryCondition.pageSize" show-less-items
                  :total="tableData.numberOfRecords" show-size-changer
                  :pageSizeOptions="pageSizeOptions" show-quick-jumper
                  @change="loadTableData" :show-total="total=>`共${total.toLocaleString()}条记录`"/>
  </a-card>

</template>

<script setup lang="ts">
import ModalForUpdating from "@/pages/project/table/component/modal-for-updating.vue"
import ModalForDeleting from "@/pages/project/table/component/modal-for-deleting.vue"
import {SearchOutlined, RedoOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons-vue"
import {reactive, ref} from "vue"
import {FormInstance, message, SelectProps} from "ant-design-vue"
import {projectApi} from "@/api/project"
import {organizationApi} from "@/api/organization"
import {pagingFormat} from "@/interfaces/paging-interface";
import {pageSizeOptions} from "@/constants/paging-constant";

function toBeCompleted() {
  message.info('待完成')
}

//声明form表单，便于使用form相关的函数。这里的变量名要跟form表单的ref保持一致
const formRef = ref<FormInstance>();

//查询按钮
function query() {
  //所有查询都从第一页开始
  queryCondition.page = 1
  loadTableData()
}

//重置查询条件
function resetQueryCondition() {
  //使用resetFields时，要确保相关的a-form-item都添加了name属性
  //同时name的值要等于reactive数据的字段名，这样form的函数才能找到相关字段
  formRef.value?.resetFields()
  //resetFields会把数组变为[null]，而不是空数组，所以这里需要自行重置
  queryCondition.organizationIDIn = []
  queryCondition.page = 1
  queryCondition.pageSize = 12
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

//查询条件
interface queryConditionFormat extends pagingFormat {
  organizationIDIn?: number[]
  nameInclude?: string
}

const queryCondition = reactive<queryConditionFormat>({
  page: 1,
  pageSize: 12,
  desc:true,
})

let organizationOptions = ref<SelectProps['options']>([])

//获取部门下拉框的值
async function loadOrganizationOptions() {
  try {
    let res = await organizationApi.getList({
      is_valid:true,
      page_size: 0,
    })
    if (res?.code === 0) {
      for (let item of res.data) {
        organizationOptions.value?.push({value: item.id, label: item.name})
      }
    } else {

    }

  } catch (err) {
    console.log(err);
  }
}

loadOrganizationOptions()

//部门选项的过滤器（下拉框搜索）
const organizationFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

//表格数据
let tableData = reactive({
  list: [],
  numberOfRecords: 0,
})

//表格栏目
let columns = ref([
  {
    title: '行号',
    dataIndex: 'line_number',
    width: '50px',
    fixed: 'left',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    width: '260px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目号',
    dataIndex: 'code',
    width: '160px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '所在国家',
    dataIndex: ['country', 'name'],
    width: '100px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目类型',
    dataIndex: ['type', 'name'],
    width: '200px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '金额',
    className: 'amount',
    dataIndex: 'amount',
    width: '120px',
    ellipsis: true,
    align: 'right',
    sorter: true,
  },
  {
    title: '币种',
    dataIndex: ['currency', 'name'],
    width: '110px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: ['status', 'name'],
    width: '110px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '所属部门',
    dataIndex: ['organization', 'name'],
    width: '300px',
    ellipsis: true,
    align: 'center',
  },

])

const tableLoading = ref(false)

async function loadTableData() {
  try {
    tableLoading.value = true
    let res = await projectApi.getList({
      ignore_data_authority:true,
      organization_id_in: queryCondition.organizationIDIn,
      name_include: queryCondition.nameInclude,
      page: queryCondition.page,
      page_size: queryCondition.pageSize,
      order_by: queryCondition.orderBy,
      desc: queryCondition.desc,
    })
    if (res?.code === 0) {
      tableData.list = res?.data
      tableData.numberOfRecords = res?.paging?.number_of_records
    } else {
      tableData.list = []
      tableData.numberOfRecords = 0
      console.log(res.message)
    }
  } catch (err) {
    tableData.list = []
    tableData.numberOfRecords = 0
    console.log(err);
  } finally {
    tableLoading.value = false
  }
}

loadTableData()

function createProject() {
  message.warn('为确保数据的一致性，新项目会从OA自动同步，无需手动添加', 5)
}

//用于修改项目信息的模态框
const modalForUpdating = ref()

function showModalForUpdating(id: number) {
  modalForUpdating.value.showModal(id)
}

//用于删除项目信息的模态框
const modalForDeleting = ref()

function showModalForDeleting(projectID: number) {
  modalForDeleting.value.showModal(projectID)
}

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
.table-buttons {
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

  //调整表格行高
  .ant-table-tbody > tr > td {
    padding: 10px;
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
