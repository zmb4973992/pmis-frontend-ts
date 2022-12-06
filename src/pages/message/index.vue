<template>

  <a-tabs class="tabs" v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="未读消息">
      <a-table :data-source="data.unread_datalist" :columns="columns"
               size="small" :pagination="false">
        <template #bodyCell="{column,record,index}">
          <template v-if="column.dataIndex === 'line_number'">
            {{ index + 1 }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a>标为已读</a>
            <a-divider type="vertical"/>
            <a-popconfirm class="pop-confirm"
                          title="确认要删除  吗？"
                          ok-text="确认"
                          cancel-text="取消"
                          placement="topRight"
                          @confirm="deleteRecord(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane key="2" tab="已读消息" force-render>
    功能未完成，效果参照“已读消息”
    </a-tab-pane>
  </a-tabs>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";

let activeKey = ref('1')

let data = reactive({
  unread_datalist: [
    {
      date_time: '2023-04-19 20:00:00',
      title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
    },
    {
      date_time: '2023-05-19 21:00:00',
      title: '今晚12点整发大红包，先到先得'
    }
  ],
  read_datalist: [
    {
      date_time: '2023-04-19 20:00:00',
      title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
    }
  ],
  totalPages: 1, totalRecords: 1,
})

let columns = ref([
  {title: '标题', dataIndex: 'title', className: 'title', width: '400px', ellipsis: true},
  {title: '时间', dataIndex: 'date_time', className: 'date_time', width: '200px'},
  {title: '操作', className: 'action', dataIndex: 'action', width: '150px'},
])
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
  th.title, th.date_time, td.date_time,
  th.button, td.button {
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
</style>
