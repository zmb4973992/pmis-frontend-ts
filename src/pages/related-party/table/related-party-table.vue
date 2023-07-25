<template>
  <!--查询区域-->
  <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-form ref="formRef" :model="queryCondition">
      <a-row :gutter="10">
        <a-col>
          <a-form-item class="query-item" label="名称" name="nameInclude">
            <a-input id="name" v-model:value="queryCondition.nameInclude" placeholder="相关方名称"/>
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

  <!--表格主体-->
  <a-card size="small" :bordered="false">
    <a-row class="table-buttons">
      <a-row class="table-left-buttons">
        <a-button size="small" type="primary" @click="showModalForCreating">
          <template #icon>
            <PlusOutlined/>
          </template>
          添加相关方
        </a-button>
      </a-row>

      <a-row class="table-right-buttons">
        <a-tooltip title="设置列" size="small">
          <a-button type="text" @click="toBeCompleted" size="small">
            <template #icon>
              <setting-outlined style="font-size: 16px"/>
            </template>
          </a-button>
        </a-tooltip>
      </a-row>
    </a-row>

    <a-table :data-source="tableData.list" :columns="columns"
             size="small" :pagination="false" :scroll="{x:1200}"
             :loading="tableLoading">
      <template #bodyCell="{ column, record,index }">
        <template v-if="column.dataIndex === 'line_number'">
          {{ index + 1 }}
        </template>
        <template v-else-if="column.dataIndex === 'name'">
          <a-tooltip>
            <template #title>
              {{ record.name }}
            </template>
            <router-link target="_blank" :to="{
            name:'相关方详情',params:{relatedPartyID: record.id}
          }">
              {{ record.name }}
            </router-link>
          </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <a-button type="link" style="padding: 0" @click="showModalForUpdating(record.id)">
          修改
        </a-button>
        <a-divider type="vertical"/>
        <a-tooltip placement="topRight">
          <template #title>如需删除，请联系管理员</template>
          <a-button type="link" style="padding: 0" danger disabled>
            删除
          </a-button>
        </a-tooltip>
        <!--          <a-popconfirm class="pop-confirm"-->
        <!--                        title="确认要删除吗？"-->
        <!--                        ok-text="确认"-->
        <!--                        cancel-text="取消"-->
        <!--                        placement="topRight"-->
        <!--                        @confirm="deleteRecord(record.id)"-->
        <!--          >-->
        <!--            <a>删除</a>-->
        <!--          </a-popconfirm>-->
      </template>
</template>
>
</a-table>

<!--分页器-->
<a-pagination class="paginator" v-model:current="queryCondition.page"
              v-model:pageSize="queryCondition.pageSize" show-less-items
              :total="tableData.numberOfRecords" showSizeChanger
              :pageSizeOptions="pageSizeOptions" showQuickJumper
              @change="loadTableData" :show-total="total=>`共${total}条记录`"/>
</a-card>

<!--新增相关方信息的模态框-->
<modal-for-creating ref="modalForCreating" @loadTableData="loadTableData"/>

<!--修改相关方信息的模态框-->
<modal-for-updating ref="modalForUpdating" @loadTableData="loadTableData"/>

<!--删除相关方信息的模态框-->
<!--  <modal-for-deleting ref="modalForDeleting" @loadTableData="loadTableData"/>-->

</template>

<script setup lang="ts">
import {SearchOutlined, RedoOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons-vue";
import {relatedPartyApi} from "@/api/related-party";
import {onMounted, reactive, ref} from "vue";
import {FormInstance, message} from "ant-design-vue";
import {pagingFormat} from "@/interfaces/paging-interface";
import router from "@/router";
import ModalForUpdating from "@/pages/related-party/table/component/modal-for-updating.vue";
import ModalForCreating from "@/pages/related-party/table/component/modal-for-creating.vue";
import {useRouter} from "vue-router";

onMounted(() => {
})
// console.log(myRouter.resolve({name: '相关方详情', params: {id: 'kd'}}));

//声明form表单，便于使用form相关的函数。这里的变量名要跟form表单的ref保持一致
const formRef = ref<FormInstance>();

function toBeCompleted() {
  message.info('待完成')
}

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

//查询条件
interface queryConditionFormat extends pagingFormat {
  nameInclude?: string
}

const queryCondition = reactive<queryConditionFormat>({
  page: 1,
  pageSize: 12,
})

let tableData = reactive({
  list: [],
  numberOfRecords: 0,
})

//表格栏目
let columns = ref([
  {
    title: '行号',
    dataIndex: 'line_number',
    width: '50px',
    fixed: 'left',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: '350px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '统一社会信用代码',
    align: 'center',
    dataIndex: 'uniform_social_credit_code'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    width: '110px',
    fixed: 'right',

  },
])

const tableLoading = ref(false)


//分页条数
const pageSizeOptions = ['12', '20', '25', '30']

//加载完组件后，开始查询数据，用于显示
onMounted(() => search())
//查询数据集，赋值给上面的data
const search = () => {
  relatedPartyApi.getList(queryCondition).then(
      (res) => {
        tableData.list = res.data
        tableData.numberOfRecords = res.paging.number_of_records
      },
  )
}
//当页码或单页数据条数发生变化时，更新查询条件，重新查询
const paginationChange = (page: number, pageSize: number) => {
  queryCondition.page = page
  queryCondition.pageSize = pageSize
  search()
}

//查看单条记录的详情
function detail(id: number) {
  message.success('数据记录id为：' + id + '，等待完善', 2)
}

async function loadTableData() {
  try {
    tableLoading.value = true
    let res = await relatedPartyApi.getList({
      name_include: queryCondition.nameInclude,
      page: queryCondition.page,
      page_size: queryCondition.pageSize,
      order_by: queryCondition.orderBy,
      desc: queryCondition.desc,
    })
    if (res?.code === 0) {
      tableData.list = res?.data
      tableData.numberOfRecords = res?.paging?.number_of_records
    } else {
      tableData.list = []
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

//用于新增相关方信息的模态框
const modalForCreating = ref()

function showModalForCreating() {
  modalForCreating.value.showModal()
}

//用于修改相关方信息的模态框
const modalForUpdating = ref()

function showModalForUpdating(relatedPartyID: number) {
  modalForUpdating.value.showModal(relatedPartyID)
}

//删除单条记录
function deleteRecord(id: number) {
  relatedPartyApi.delete({id: id}).then(
      res => {
        //这里还需要对返回结果进行判断后再处理，只是验证了模型能跑通
        message.success('删除成功', 2)
        relatedPartyApi.getList(queryCondition).then(
            (res) => {
              tableData.list = res.data
              tableData.numberOfRecords = res.paging.total_records
            },
        )
      }
  )
}

function showDetail(relatedPartyID: number) {
  const myRouter = useRouter()
  console.log(myRouter);
  console.log(myRouter.resolve({name: '相关方详情', params: {relatedPartyID: 333}}));

}
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
.table-buttons {
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
</style>
