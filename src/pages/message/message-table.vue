<template>
  <a-card :bordered="false" :body-style="{padding:'0 10px 10px 15px'}">
    <a-tabs>
      <a-tab-pane key="unread_message" tab="未读消息">
        <unread-message :user-id="userID"
        @load-read-messages="loadReadMessages"/>
      </a-tab-pane>

      <a-tab-pane key="read_message" tab="已读消息">
        <read-message ref="readMessageRef" :user-id="userID"/>
      </a-tab-pane>

    </a-tabs>


  </a-card>


</template>

<script setup lang="ts">
import { ref} from "vue";
import useUserStore from "@/store/user";
import {storeToRefs} from "pinia";
import UnreadMessage from "@/pages/message/component/unread-message.vue";
import ReadMessage from "@/pages/message/component/read-message.vue";

const userStore = useUserStore()
const {userID} = storeToRefs(userStore)

let columns = ref([
  {title: '标题', dataIndex: 'title', className: 'title', width: '400px', ellipsis: true},
  {title: '时间', dataIndex: 'date_time', className: 'date_time', width: '200px'},
  {title: '操作', className: 'action', dataIndex: 'action', width: '150px'},
])

const readMessageRef = ref()
function loadReadMessages() {
  readMessageRef.value.loadTableData()
}

</script>

<style scoped lang="scss">
.tabs {
  background-color: white;
  padding: {
    left: 20px;
    bottom: 20px;
  };
}

//表格内容居中
:deep(.ant-table) {

}


</style>
