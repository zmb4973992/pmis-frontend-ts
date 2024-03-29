<template>
  <a-card size="small" :bordered="false"
          :body-style="{padding:0}">

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
            name:'合同详情',params:{contractID: record.id}
          }">
              {{ record.name }}
            </router-link>
          </template>

          <template v-else>
            <router-link to="" :disabled="true">
              <a-tooltip>
                <template #title>您没有权限查看该合同的详情</template>
                {{ record.name }}
              </a-tooltip>

            </router-link>
          </template>
        </template>

        <template v-else-if="column.dataIndex[0] === 'project' && column.dataIndex[1] === 'name'">
          <template v-if="record?.authorized === true">
            <router-link target="_blank" :to="{name:'项目详情',params:{projectID: record.project.id}}">
              {{ record.project.name }}
            </router-link>
          </template>

          <template v-else>
            <router-link to="" :disabled="true">
              <a-tooltip>
                <template #title>您没有权限查看该项目的详情</template>
                {{ record.project.name }}
              </a-tooltip>
            </router-link>
          </template>

        </template>

        <template v-else-if="column.dataIndex[0] === 'fund_direction' && column.dataIndex[1] === 'name'">
          <template v-if="record.fund_direction?.name === '付款合同'">
            <span style="color: green">付款</span>
          </template>
          <template v-if="record.fund_direction?.name === '收款合同'">
            <span style="color: red">收款</span>
          </template>
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
                  @change="loadTableData" :show-total="total=>`共${total}条记录`"/>
  </a-card>
</template>

<script setup lang="ts">
import {pageSizeOptions} from "@/constants/paging-constant";
import {reactive, ref} from "vue";
import {pagingFormat} from "@/interfaces/paging-interface";
import {contractApi} from "@/api/contract";

const props = defineProps<{ relatedPartyId: number }>()

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
    title: '合同名称',
    dataIndex: 'name',
    width: '250px',
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
    title: '类型',
    dataIndex: ['type', 'name'],
    width: '120px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '资金方向',
    dataIndex: ['fund_direction', 'name'],
    width: '120px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '金额',
    dataIndex: 'amount',
    className: 'amount',
    width: '160px',
    ellipsis: true,
    align: 'right',
    sorter: true,
  },
  {
    title: '币种',
    dataIndex: ['currency', 'name'],
    width: '120px',
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
  relatedPartyID: number
}

const queryCondition = reactive<queryConditionFormat>({
  relatedPartyID: props.relatedPartyId,
  page: 1,
  pageSize: 12,
})

const tableLoading = ref(false)

async function loadTableData() {
  try {
    tableLoading.value = true
    let res = await contractApi.getList({
      related_party_id: queryCondition.relatedPartyID,
      ignore_data_authority:true,
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
