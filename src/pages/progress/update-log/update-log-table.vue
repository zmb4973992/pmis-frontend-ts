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
                        style="width:200px"/>
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
        <!--        <a-tooltip placement="right">-->
        <!--          <template #title>-->
        <!--            为确保数据的一致性，新合同会从OA自动同步，无需手动添加-->
        <!--          </template>-->
        <!--          <a-button size="small" type="primary" disabled>-->
        <!--            <template #icon>-->
        <!--              <PlusOutlined/>-->
        <!--            </template>-->
        <!--            添加合同-->
        <!--          </a-button>-->
        <!--        </a-tooltip>-->

        <div class="buttons-for-table-setting">
          <a-tooltip title="设置列" size="small">
            <!--            <a-button type="text" @click="toBeCompleted" size="small">-->
            <!--              <template #icon>-->
            <!--                <setting-outlined style="font-size: 16px"/>-->
            <!--              </template>-->
            <!--            </a-button>-->
          </a-tooltip>
        </div>
      </a-row>

      <a-table :data-source="tableData.list" :columns="columns"
               size="small" :pagination="false" :scroll="{x:1000}"
               @change="tableChange" :loading="tableLoading">
        <template #bodyCell="{column,record,index}">
          <template v-if="column.dataIndex === 'line_number'">
            {{ index + 1 }}
          </template>

          <template v-else-if="column.dataIndex[0] === 'project' && column.dataIndex[1] === 'name'">
            <a-tooltip v-if="record.project && record.project.id">
              <template #title>
                {{ record.project.name }}
              </template>
              <router-link target="_blank" :to="{name:'项目详情',params:{projectID: record.project.id}}">
                {{ record.project?.name }}
              </router-link>
            </a-tooltip>
          </template>

          <template v-else-if="column.dataIndex[0] === 'operator' && column.dataIndex[1] === 'full_name'">
            {{ record.operator?.full_name }}
          </template>

          <template v-else-if="column.dataIndex[0] === 'operation_type' && column.dataIndex[1] === 'name'">
            <template v-if="record.operation_type?.name === '添加'">
              <span style="color: green">添加</span>
            </template>
            <template v-if="record.operation_type?.name === '修改'">
              <span style="color: darkorange">修改</span>
            </template>
            <template v-if="record.operation_type?.name === '删除'">
              <span style="color: red">删除</span>
            </template>
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

  <!--修改合同信息的模态框-->
  <ModalForUpdating ref="modalForUpdating" @loadTableData="loadTableData"/>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
import {FormInstance,  SelectProps} from "ant-design-vue";
import {projectApi} from "@/api/project";
import {pageSizeOptions} from "@/constants/paging-constant";
import {pagingFormat} from "@/interfaces/paging-interface";
import ModalForUpdating from "@/pages/contract/table/component/modal-for-updating.vue";
import {operationLogApi} from "@/api/operation-log";

//查询条件
interface queryConditionFormat extends pagingFormat {
  projectID?: number
  nameInclude?: string
}

const queryCondition = reactive<queryConditionFormat>({
  page: 1,
  pageSize: 12,
  desc: true,
})

//部门选项的过滤器（下拉框搜索）
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

const tableData = reactive({
  list: [],
  numberOfPages: 1,
  numberOfRecords: 0,
})

const tableLoading = ref(false)

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
    title: '项目名称',
    dataIndex: ['project', 'name'],
    width: '250px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '操作人',
    dataIndex: ['operator', 'full_name'],
    width: '80px',
    align: 'center',
  },
  {
    title: '日期',
    dataIndex: 'date',
    width: '100px',
    align: 'center',
  },
  {
    title: '进行的操作',
    dataIndex: ['operation_type', 'name'],
    width: '100px',
    align: 'center',
  },
  {
    title: '详情',
    dataIndex: 'detail',
    width: '300px',
    align: 'center'
  },
])

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

async function loadTableData() {
  try {
    tableLoading.value = true
    let res = await operationLogApi.getList({
      project_id: queryCondition.projectID,
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
      tableData.list = res?.data
      tableData.numberOfPages = 1
      tableData.numberOfRecords = 0
    }
  } catch (err) {
    tableData.list = []
    tableData.numberOfPages = 1
    tableData.numberOfRecords = 0
    console.log(err);
  } finally {
    tableLoading.value = false
  }
}

loadTableData()

//用于修改合同信息的模态框
const modalForUpdating = ref()

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

loadProjectOptions()

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

  //调整表格行高
  .ant-table-tbody > tr > td {
    padding: 6px;
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
