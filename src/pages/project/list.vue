<template>
  <!--  搜索框-->
  <div class="search-bar">
    <a-select id="department-id-in" show-search mode="multiple" :filter-option="filterOption"
              :max-tag-count="1" :max-tag-text-length="2" placeholder="请选择部门"
              v-model:value="queryCondition.department_id_in" :options="options1"
              style="width:150px;margin-right: 10px" >
    </a-select>
    <a-input id="project-name" v-model:value="queryCondition.chinese_name_include" placeholder="项目名称">
    </a-input>

    <a-button class="button" type="primary" @click="search">
      <template #icon>
        <SearchOutlined/>
      </template>
      搜索
    </a-button>
    <a-button class="button" type="primary" @click="reset">
      <template #icon>
        <RedoOutlined/>
      </template>
      重置
    </a-button>
  </div>

  <!--  表格主体-->
  <a-table :data-source="data.dataList" :columns="columns"
           size="small" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">

        <a>详情</a>
        <a-divider type="vertical"/>
        <a>修改</a>
        <a-divider type="vertical"/>
        <a-popconfirm class="pop-confirm"
                      title="确认要删除吗？"
                      ok-text="确认"
                      cancel-text="取消"
                      placement="topRight"
                      @confirm="deleteRecord(record.id)"
        >
          <a>删除</a>
        </a-popconfirm>
      </template>
    </template>
    >
  </a-table>

  <!--  分页器-->
  <a-pagination v-model:pageSize="queryCondition.page_size" :total="data.totalRecords"
                showSizeChanger :pageSizeOptions="pageSizeOptions"
                showQuickJumper @change="paginationChange"
                :show-total="total=>`共${total}条记录`"
                id="paginator"/>
</template>

<script setup lang="ts">
import {SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
import {DeleteRelatedParty} from "@/api/related_party";
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import {GetRelatedPartyList} from "@/api/related_party";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import {CreateProject, DeleteProject, GetProject, GetProjectList, IProjectList, UpdateProject} from "@/api/project";
import {GetDepartmentList} from "@/api/department";
import {log} from "util";

const queryCondition = reactive<IProjectList>({
  page: 1, page_size: 12, order_by: '', desc: false,
  department_id_in: [], department_name_like: '',
})

const options1 = ref([
  {value: 'aa', label: '我是aa'},
  {value: 'ab', label: '我是ab'},
  {value: 'bc', label: '我是bc'}
])
const change = (value: any) => console.log(value)
const filterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0

const pageSizeOptions = ['12', '20', '25', '30']

let data = reactive({
  dataList: [], totalPages: 1, totalRecords: 1,
})

let columns = ref([
  {title: '中文名称', dataIndex: 'chinese_name', className: 'chinese_name'},
  {title: '英文名称', dataIndex: 'english_name', className: 'english_name', width: '10%', ellipsis: true},
  {title: '统一社会信用代码', className: 'uniform_social_credit_code', dataIndex: 'uniform_social_credit_code'},
  {title: '操作', className: 'action', dataIndex: 'action', width: '150px'},
])

GetProjectList(queryCondition).then(res => console.log(res))

onMounted(() => search())

onBeforeMount(()=>{
  GetDepartmentList({page_size:100}).then(res => console.log(res))
})

const search = () => {
  GetRelatedPartyList(queryCondition).then(
      (res) => {
        data.dataList = res.data
        data.totalPages = res.paging.total_pages
        data.totalRecords = res.paging.total_records
      },
  )
}

const paginationChange = (page: number, pageSize: number) => {
  queryCondition.page = page
  queryCondition.page_size = pageSize
  search()
}

const reset = () => {
  queryCondition.chinese_name_include = ''
  queryCondition.english_name_include = ''
  queryCondition.page = 1
  queryCondition.page_size = 12
  search()
}

// const deleteRecord = (id: number) => DeleteRelatedParty(id).then(
//     res => {
//       data.dataList.splice(id,1)
//       message.success('删除成功')
//       console.log(res)
//
//     }
// )


const deleteRecord = (id: number) => DeleteRelatedParty(id).then(
    res => {
      //这里还需要对返回结果进行判断后再处理，只是验证了模型能跑通
      message.success('删除成功', 2)
      GetRelatedPartyList(queryCondition).then(
          (res) => {
            data.dataList = res.data
            data.totalPages = res.paging.total_pages
            data.totalRecords = res.paging.total_records
          },
      )
    }
)


</script>

<style scoped lang="scss">
.search-bar {
  background-color: white;
  padding: 7px;
  margin-bottom: 7px;

  #department-id-in, #project-name {
    width: 180px;
    margin-right: 10px;
  }

  .button {
    margin-right: 10px;
  }
}


//表格内容居中
:deep(.ant-table) {
  th.chinese_name, td.chinese_name, th.english_name, td.english_name,
  th.uniform_social_credit_code, td.uniform_social_credit_code,
  th.action, td.action {
    text-align: center;
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
