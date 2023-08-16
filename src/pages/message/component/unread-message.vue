<template>
  <a-card size="small" :bordered="false"
          :body-style="{padding:0}">

    <a-table :data-source="tableData.list" :columns="columns"
             size="small" :pagination="false"
             @change="tableChange" :loading="tableLoading">
      <template #bodyCell="{column,record,index}">
        <template v-if="column.dataIndex === 'line_number'">
          {{ index + 1 }}
        </template>

        <template v-if="column.dataIndex === 'title'">
          <a-button type="link" style="padding: 0" @click="showModalForDetail(record.id)">
            {{ record.title }}
          </a-button>
        </template>

        <template v-else-if="column.dataIndex === 'datetime'">
          {{ record.datetime }}
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" style="padding: 0" @click="markAsRead(record.id)">
            标为已读
          </a-button>
          <a-divider type="vertical"/>
          <a-button type="link" style="padding: 0" @click="deleteMessage(record.id)">
            删除
          </a-button>
        </template>
      </template>
    </a-table>

    <!--分页器-->
    <a-pagination class="paginator" v-model:current="queryCondition.page"
                  v-model:pageSize="queryCondition.pageSize" show-less-items
                  :total="tableData.numberOfRecords" show-size-changer
                  :pageSizeOptions="pageSizeOptions" show-quick-jumper
                  @change="loadTableData" :show-total="total=>`共${total}条记录`"/>
  </a-card>

  <!--用于展示消息详情的模态框-->
  <message-detail ref="modalForDetail"/>

</template>

<script setup lang="ts">
import {pageSizeOptions} from "@/constants/paging-constant";
import {reactive, ref} from "vue";
import {pagingFormat} from "@/interfaces/paging-interface";
import {messageApi} from "@/api/message";
import MessageDetail from "@/pages/message/component/message-detail.vue";
import {message, Modal} from "ant-design-vue";

const props = defineProps<{ userId: number }>()
const emit = defineEmits(["loadReadMessages"])

let tableData = reactive({
  list: [],
  numberOfRecords: 0,
})

//表格栏目
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
    title: '标题',
    dataIndex: 'title',
    width: '350px',
    align: 'left',
  },
  {
    title: '时间',
    dataIndex: 'datetime',
    width: '160px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '110px',
    ellipsis: true,
    align: 'center',
  },

])

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
  isRead?: boolean
}

const queryCondition = reactive<queryConditionFormat>({
  page: 1,
  pageSize: 12,
})

const tableLoading = ref(false)

async function loadTableData() {
  try {
    tableLoading.value = true
    let res = await messageApi.getList({
      is_read:false,
      page: queryCondition.page,
      page_size: queryCondition.pageSize,
      order_by: queryCondition.orderBy,
      desc: queryCondition.desc,
    })
    if (res?.code === 0) {
      tableData.list = res?.data
      tableData.numberOfRecords = res?.paging?.number_of_records
    } else {
      tableData.list = res?.data
      tableData.numberOfRecords = 0
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

//用于展示消息详情的模态框
const modalForDetail = ref()

function showModalForDetail(messageID: number) {
  modalForDetail.value.showModal(messageID)
}

//标为已读
async function markAsRead(messageID: number) {
  try {
    const res = await messageApi.update({id: messageID})
    if (res.code === 0) {
      message.success("标记成功")
      await loadTableData()
      emit("loadReadMessages")
    } else {
      console.log(res.message);
    }
  } catch (e: any) {
    message.error(e)
  }
}

//删除消息
async function deleteMessage(messageID:number) {
  try {
    Modal.confirm({
      title: "确定要删除这条消息吗？",
      async onOk() {
        const res = await messageApi.delete({id: messageID})
        if (res.code === 0) {
          message.success("删除成功")
          await loadTableData()
        } else {
          console.log(res.message);
        }
      },
      onCancel() {
      },
    })
  } catch (e:any) {
    message.error(e)
  }
}

</script>

<style scoped lang="scss">
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
    padding: 4px;
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
