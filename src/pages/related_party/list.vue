<template>
  <div>
    <a-button @click="test">
      测试
    </a-button>
  </div>
  <Search_bar/>
  <a-table class="ant-table-striped"
           :data-source="dataSource"
           :columns="columns" size="small"
           :pagination="pagination"
  >
  </a-table>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {GetRelatedPartyList} from "@/api/related_party";
import '@/pages/related_party/search_bar.vue'
import Search_bar from "@/pages/related_party/search_bar.vue";
import router from '@/router'

let dataSource = ref([])
let columns = ref([
  {title: '中文名称', dataIndex: 'chinese_name', key: 'chinese_name',},
  {title: '英文名称', dataIndex: 'english_name', key: 'english_name', width: '10%', ellipsis: true},
  {title: '统一社会信用代码', dataIndex: 'uniform_social_credit_code', key: 'uniform_social_credit_code'},
  {title: '操作', key: 'action'},
])
let pagination = reactive({
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '15'],
  size: "middle",
})

GetRelatedPartyList({page_size: 100}).then(
    (res) => {
      dataSource.value = res.data
    }
)


</script>

<style scoped lang="scss">

.search-bar {
  background-color: white;
  margin-bottom: 6px;
  padding: 10px;
}

//修改鼠标悬浮行的样式
//由于style为scoped，所以需要使用vue3的:deep()深度穿透
:deep(.ant-table-tbody) {
  > tr:hover > td {
    background-color: #f0f0f0;
  }
}
</style>
