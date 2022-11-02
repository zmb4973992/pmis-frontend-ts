<template>
  <!--  搜索框-->
  <div class="search-bar">
    <a-input id="chinese-name" v-model:value="queryCondition.chinese_name_include" placeholder="相关方中文名称">
    </a-input>
    <a-input id="english-name" v-model:value="queryCondition.english_name_include" placeholder="相关方英文名称">
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

const a = () => alert('test ok')


import {onMounted, reactive, ref} from "vue";
import {GetRelatedPartyList} from "@/api/related_party";

const pageSizeOptions = ['12', '20', '25', '30']

const queryCondition = reactive({
  page: 1, page_size: 12, chinese_name_include: '', english_name_include: '',
})

let data = reactive({
  dataList: [], totalPages: 1, totalRecords: 1,
})

let columns = ref([
  {title: '中文名称', dataIndex: 'chinese_name', key: 'chinese_name', className: 'chinese_name'},
  {title: '英文名称', dataIndex: 'english_name', key: 'english_name', width: '10%', ellipsis: true},
  {title: '统一社会信用代码', dataIndex: 'uniform_social_credit_code', key: 'uniform_social_credit_code'},
  {title: '操作', key: 'action'},
])


onMounted(() => search())

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

</script>

<style scoped lang="scss">
.search-bar {
  background-color: white;
  padding: 7px;
  margin-bottom: 7px;

  #chinese-name, #english-name {
    width: 180px;
    margin-right: 10px;
  }

  .button {
    margin-right: 10px;
  }
}

:deep(th.chinese_name, td.chinese_name) {
  text-align: center !important;
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
