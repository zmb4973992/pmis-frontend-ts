<template>
  <!--  搜索框-->
  <div class="search-bar">
    <a-select id="department-id-in" show-search mode="multiple" :filter-option="filterOption"
              :max-tag-count="1" :max-tag-text-length="2" placeholder="请选择部门"
              v-model:value="queryCondition.department_id_in" :options="departmentOptions"
              style="width:150px;margin-right: 10px">
    </a-select>
    <a-input id="project-name-like" v-model:value="queryCondition.project_name_like" placeholder="项目名称">
    </a-input>

    <a-button class="button" type="primary" @click="search">
      <template #icon>
        <SearchOutlined/>
      </template>
      搜索
    </a-button>
    <a-button class="button" @click="reset">
      <template #icon>
        <RedoOutlined/>
      </template>
      重置
    </a-button>
    <a-button class="button" @click="create">
      <template #icon>
        <PlusOutlined/>
      </template>
      添加项目
    </a-button>
  </div>

  <!--  表格主体-->
  <a-table :data-source="data.dataList" :columns="columns"
           size="small" :pagination="false">
    <template #bodyCell="{column,record,index}">
      <template v-if="column.dataIndex === 'line_number'">
        {{ index + 1 }}
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <a>详情</a>
        <a-divider type="vertical"/>
        <a>修改</a>
        <a-divider type="vertical"/>
        <a-popconfirm class="pop-confirm"
                      title="确认要删除吗？"
                      ok-text="确认"
                      cancel-text="取消"
                      placement="topRight"
                      @confirm="deleteRecord(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>

  <!--  分页器-->
  <a-pagination v-model:pageSize="queryCondition.page_size" :total="data.totalRecords"
                showSizeChanger :pageSizeOptions="pageSizeOptions"
                showQuickJumper @change="paginationChange"
                :show-total="total=>`共${total}条记录`"
                id="paginator"/>
</template>

<script setup lang="ts">
import {SearchOutlined, RedoOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {DeleteProject, GetProjectList, IProjectList} from "@/api/project";
import {GetDepartmentList} from "@/api/department";
//表格的查询条件
const queryCondition = reactive<IProjectList>({
  page: 1, page_size: 12, order_by: '', desc: false,
  department_id_in: [], project_name_like: '',
})
//部门选项，value为真实值，label为显示值
let departmentOptions = ref<{ value: number; label: string }[]>([])
//获取部门选项的值
GetDepartmentList({page_size: 100}).then(
    res => {
      const departmentList = res.data.filter((item: any) => item.level === '部门')
      for (let item of departmentList) {
        departmentOptions.value.push({value: item.id, label: item.name})
      }
    })
//部门选项的过滤器（下拉框搜索）
const filterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0

//分页器选项
const pageSizeOptions = ['12', '20', '25', '30']

let data = reactive({
  dataList: [], totalPages: 1, totalRecords: 1,
})

let columns = ref([
  {title: '行号', dataIndex: 'line_number', className: 'line_number', width: '50px'},
  {title: '项目简称', dataIndex: 'project_short_name', className: 'project_short_name', width: '15%', ellipsis: true},
  {title: '项目号', dataIndex: 'project_code', className: 'project_code', width: '10%', ellipsis: true},
  {title: '项目类型', className: 'project_type', dataIndex: 'project_type', width: '10%', ellipsis: true},
  {title: '所属部门', className: 'department', dataIndex: ['department', 'name'], width: '15%', ellipsis: true},
  {title: '金额', className: 'amount', dataIndex: 'amount', width: '80px'},
  {title: '币种', className: 'currency', dataIndex: 'currency', width: '60px', ellipsis: true},
  {title: '操作', className: 'action', dataIndex: 'action', width: '150px'},
])

onMounted(() => search())

const search = () => {
  GetProjectList(queryCondition).then(
      (res) => {
        data.dataList = res.data
        data.totalPages = res.paging.total_pages
        data.totalRecords = res.paging.total_records
      },
  )
}
//页码变化时的回调函数
const paginationChange = (page: number, pageSize: number) => {
  queryCondition.page = page
  queryCondition.page_size = pageSize
  search()
}

const reset = () => {
  queryCondition.department_id_in = []
  queryCondition.project_name_like = ''
  queryCondition.page = 1
  queryCondition.page_size = 12
  search()
}

const deleteRecord = (projectID: number) => {
  console.log(projectID)
  DeleteProject(projectID).then(
      res => {
        //这里还需要对返回结果进行判断后再处理，只是验证了模型能跑通
        message.success('删除成功', 2)
        GetProjectList(queryCondition).then(
            (res) => {
              data.dataList = res.data
              data.totalPages = res.paging.total_pages
              data.totalRecords = res.paging.total_records
            },
        )
      }
  )
}

const create = () => console.log('点击了create')

</script>

<style scoped lang="scss">
.search-bar {
  background-color: white;
  padding: 7px;
  margin-bottom: 7px;

  #department-id-in, #project-name-like {
    width: 180px;
    margin-right: 10px;
  }

  .button {
    margin-right: 10px;
  }
}


//表格内容居中
:deep(.ant-table) {
  th.line_number, td.line_number, th.project_short_name, td.project_short_name,
  th.project_code, td.project_code, th.project_type, td.project_type,
  th.department, td.department, th.amount, th.currency, td.currency,
  th.action, td.action {
    text-align: center;
  }

  td.amount {
    text-align: right;
  }
}

//修改鼠标悬浮行的样式
//由于style为scoped，所以需要使用vue3的:deep()深度穿透
:deep(.ant-table-tbody) {
  > tr:hover > td {
    background-color: #f0f0f0;
  }
}

#paginator {
  background-color: white;
  text-align: right;
  padding: {
    top: 10px;
    bottom: 10px;
    right: 10px;
  }
}
</style>
