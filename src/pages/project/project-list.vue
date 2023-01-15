<template>
  <!--查询条件表单，2023/1/13重写-->
  <a-form class="query-form">
    <!--这里用a-row，是为了确保表单元素在一行内，如果内容超出一行，可以自动换行-->
    <a-row>
      <a-form-item class="query-form-item" label="部门">
        <a-select id="department-id-in" show-search mode="multiple" :filter-option="filterOption"
                  :max-tag-count="1" :max-tag-text-length="2" placeholder="部门"
                  v-model:value="queryForm.department_id_in" :options="limitedDepartmentOptions"
                  style="width:150px">
        </a-select>
      </a-form-item>
      <a-form-item class="query-form-item" label="项目名称">
        <a-input id="project-name-like" v-model:value="queryForm.project_name_like"
                 placeholder="项目名称" style="width: 180px">
        </a-input>
      </a-form-item>
      <a-form-item class="query-form-item">
        <a-button-group>
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
        </a-button-group>
      </a-form-item>
    </a-row>
  </a-form>

  <!--用a-card包裹，是为了后期添加loading效果，以及设置整体的内外边距、背景色等-->
  <a-card size="small">
    <!--  表格主体-->
    <a-row class="table-buttons-row">
        <a-button @click="create" type="primary" size="small">
          <template #icon>
            <PlusOutlined/>
          </template>
          添加项目
        </a-button>
      <div class="buttons-for-table-setting">
        <a-tooltip title="设置列" size="small">
          <a-button type="text" @click="showModal" size="small">
            <template #icon>
              <setting-outlined/>
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </a-row>
    <a-table :data-source="data.dataList" :columns="columns"
             size="small" :pagination="false" :scroll="{x:1500}"
             :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    >
      <template #bodyCell="{column,record,index}">
        <template v-if="column.dataIndex === 'line_number'">
          {{ index + 1 }}
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a>详情</a>
          <a-divider type="vertical"/>
          <a @click="updateRecord(record.id)">修改</a>
          <a-divider type="vertical"/>
          <a-popconfirm class="pop-confirm"
                        title="确认要删除吗？"
                        ok-text="确认"
                        cancel-text="取消"
                        placement="topRight"
                        @confirm="deleteRecord(record.id)">
            <a style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <!--分页器-->
    <a-pagination v-model:pageSize="queryForm.page_size" :total="data.totalRecords"
                  showSizeChanger :pageSizeOptions="pageSizeOptions"
                  showQuickJumper @change="paginationChange"
                  :show-total="total=>`共${total}条记录`"
                  id="paginator"/>
  </a-card>


  <!--修改项目信息的模态框-->
  <a-modal v-model:visible="visible" title="修改项目" width="1000px" @ok="submitUpdate">
    <a-form>
      <a-row>
        <a-col :span="10">
          <a-form-item label="项目全称">
            <a-input v-model:value="project.projectFullName"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="7" style="padding-left: 10px">
          <a-form-item label="项目简称">
            <a-input v-model:value="project.projectShortName"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="7" style="padding-left: 10px">
          <a-form-item label="归属部门">
            <a-select id="project-department" v-model:value="project.departmentID"
                      :options="departmentOptions">
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item label="项目编号">
            <a-input v-model:value="project.projectCode"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="项目类型">
            <a-select v-model:value="project.projectType" :options="projectTypeOptions"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">3</a-col>
      </a-row>
    </a-form>
  </a-modal>

</template>

<script setup lang="ts">
import {SearchOutlined, RedoOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons-vue";
import {onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {DeleteProject, GetProjectList, IProjectList} from "@/api/project";
import {GetDepartmentList} from "@/api/department";

//查询条件
const queryForm = reactive<IProjectList>({
  page: 1, page_size: 12, order_by: '', desc: false,
  department_id_in: [], project_name_like: '',
})
//部门选项，value为真实值，label为显示值
//这里是受限制的选项，只显示有权限看到的值
let limitedDepartmentOptions = ref<{ value: number; label: string }[]>([])
//这是所有的值，无限制
const departmentOptions = ref<{ value: number; label: string }[]>([])
const projectTypeOptions = ref<{ label: string }[]>([])
//获取部门选项的值
GetDepartmentList({page_size: 100, verify_role: true}).then(
    res => {
      const departmentList = res.data.filter((item: any) => item.level === '部门')
      for (let item of departmentList) {
        limitedDepartmentOptions.value.push({value: item.id, label: item.name})
      }
    })
//部门选项的过滤器（下拉框搜索）
const filterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

//分页器选项
const pageSizeOptions = ['12', '20', '25', '30']

let data = reactive({
  dataList: [], totalPages: 1, totalRecords: 1,
})

let columns = ref([
  {title: '行号', dataIndex: 'line_number', className: 'line_number', width: '50px', fixed: 'left'},
  {
    title: '项目简称',
    dataIndex: 'project_short_name',
    className: 'project_short_name',
    width: '200px',
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '项目号',
    dataIndex: 'project_code',
    className: 'project_code',
    width: '150px',
    ellipsis: true,
    sorter: (a: any, b: any) => a.project_code - b.project_code
  },
  {title: '项目类型', className: 'project_type', dataIndex: 'project_type', width: '300px', ellipsis: true},
  {title: '所属部门', className: 'department', dataIndex: ['department', 'name'], width: '300px', ellipsis: true},
  {
    title: '金额',
    className: 'amount',
    dataIndex: 'amount',
    width: '280px',
    sorter: (a: any, b: any) => a.amount - b.amount
  },
  {title: '币种', className: 'currency', dataIndex: 'currency', width: '60px', ellipsis: true},
  {title: '操作', className: 'action', dataIndex: 'action', width: '150px', fixed: 'right'},
])

onMounted(() => search())

const search = () => {
  GetProjectList(queryForm).then(
      (res) => {
        data.dataList = res.data
        data.totalPages = res.paging.total_pages
        data.totalRecords = res.paging.total_records
      },
  )
}
//页码变化时的回调函数
const paginationChange = (page: number, pageSize: number) => {
  queryForm.page = page
  queryForm.page_size = pageSize
  search()
}

const reset = () => {
  queryForm.department_id_in = []
  queryForm.project_name_like = ''
  queryForm.page = 1
  queryForm.page_size = 12
  search()
}
//修改项目信息的模态框是否可见
const visible = ref(false)

const project = reactive({
  projectFullName: '', projectShortName: '', departmentID: 0,
  projectCode: '', projectType: '', segmentedProjectType: '',
  amount: 0, currency: '', exchangeRate: 0, projectStatus: '',
  relatedPartyID: 0, country: '', duration: 0, signingDate: '',
  effectiveDate: '', commissioningDate: '', task: '',
})

//点击修改，准备修改项目信息
function updateRecord(projectID: number) {
  visible.value = true
  GetDepartmentList().then(res => {
    for (let item of res.data) {
      departmentOptions.value.push({value: item.id, label: item.name})
    }
  })

}

//确认修改信息
function submitUpdate() {
  message.success('成功提交')
  visible.value = false

}

const deleteRecord = (projectID: number) => {
  console.log(projectID)
  DeleteProject(projectID).then(
      () => {
        //这里还需要对返回结果进行判断后再处理，只是验证了模型能跑通
        message.success('删除成功', 2)
        GetProjectList(queryForm).then(
            (res) => {
              data.dataList = res.data
              data.totalPages = res.paging.total_pages
              data.totalRecords = res.paging.total_records
            },
        )
      }
  )
}

const create = () =>
    message.warn('为确保数据的一致性，新项目会从OA自动同步，无需手动添加', 5)
</script>

<style scoped lang="scss">
//查询表单的样式
.query-form {
  background-color: white;
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;

  .query-form-item {
    margin: {
      top: 10px;
      right: 10px;
      bottom: 0;
    }
  }
}

//表单操作按钮的样式
.table-buttons-row {
  background-color: white;
  justify-content: space-between;
  margin-bottom: 10px;
  .buttons-for-table-setting {
    float: right;
  }
}



//表格内容居中
:deep(.ant-table) {
  th.line_number, td.line_number, th.project_short_name, td.project_short_name,
  th.project_code, td.project_code, th.project_type, td.project_type,
  th.department, td.department, th.amount, th.currency, td.currency,
  th.button, td.button {
    text-align: center;
  }

  td.amount {
    text-align: right;
  }

  ::-webkit-scrollbar-thumb {
    /* 滚动条里的小方块 */
    border-radius: 5px;
    background: #c9c9c9;
  }

  ::-webkit-scrollbar-track {
    /* 滚动条里面的轨道 */
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
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

//滚动条样式，默认不显示表格的滚动条
:deep(.ant-table) {
  ::-webkit-scrollbar {
    display: none;
  }

  //由于滚动条默认不显示，这里需要给滚动条预留边界，否则鼠标移入表格时会影响下面内容的排布
  .ant-table-content {
    padding-bottom: 8px;
  }
}

//滚动条样式，鼠标移入表格后显示滚动条
:deep(.ant-table:hover) {
  ::-webkit-scrollbar {
    /* 滚动条整体样式 */
    width: 8px;
    height: 8px;
    display: block;
  }

  //由于这里显示了滚动条，所以之前预留的padding需要取消
  .ant-table-content {
    padding-bottom: 0;
  }
}

</style>
