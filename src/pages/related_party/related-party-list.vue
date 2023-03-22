<template>
  <!--搜索框-->
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

  <!--表格主体-->
  <a-table :data-source="data.list" :columns="columns"
           :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
           size="small" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">

        <a @click="detail(record.id)">详情</a>
        <a-divider type="vertical"/>
        <a @click="updateRecord(record.id)">修改</a>
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

  <!--分页器-->
  <a-pagination v-model:pageSize="queryCondition.page_size" :total="data.totalRecords"
                showSizeChanger :pageSizeOptions="pageSizeOptions"
                showQuickJumper @change="paginationChange"
                :show-total="total=>`共${total}条记录`"
                id="paginator"/>
  <!--抽屉-->
  <a-drawer v-model:visible="visible" title="修改相关方信息">
    <template #extra>
      <!--UI推荐将操作放在这里，不接受推荐，因为不符合操作直觉-->
    </template>
    <div style="margin-bottom: 5px;color: #848587">中文名称：</div>
    <a-input style="margin-bottom: 10px" v-model:value="relatedParty.chineseName"></a-input>
    <div style="margin-bottom: 5px;color: #848587">英文名称：</div>
    <a-input style="margin-bottom: 10px" v-model:value="relatedParty.englishName"></a-input>
    <div style="margin-bottom: 5px;color: #848587">统一社会信用代码：</div>
    <a-input style="margin-bottom: 10px"
             v-model:value="relatedParty.uniformSocialCreditCode"></a-input>
    <div style="margin-bottom: 5px;color: #848587">地址：</div>
    <a-input style="margin-bottom: 10px" v-model:value="relatedParty.address"></a-input>
    <div style="margin-bottom: 5px;color: #848587">电话：</div>
    <a-input style="margin-bottom: 10px" v-model:value="relatedParty.telephone"></a-input>
    <template #footer>
      <a-space style="float: right;">
        <a-button style="margin-right: 10px" @click="cancel">取消</a-button>
        <a-button style="" type="primary" @click="confirm(relatedParty.id,relatedParty)">确认</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import {SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
import {relatedPartyApi} from "@/api/related-party";
import {onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
//分页条数
const pageSizeOptions = ['12', '20', '25', '30']
//表格查询条件
const queryCondition = reactive({
  page: 1, page_size: 12, chinese_name_include: '', english_name_include: '',
})
//查到的数据集
let data = reactive({
  list: [], totalPages: 1, totalRecords: 1,
})
//表格栏目
let columns = ref([
  {title: '中文名称', dataIndex: 'chinese_name', className: 'chinese_name'},
  {title: '英文名称', dataIndex: 'english_name', className: 'english_name', width: '10%', ellipsis: true},
  {title: '统一社会信用代码', className: 'uniform_social_credit_code', dataIndex: 'uniform_social_credit_code'},
  {title: '操作', className: 'action', dataIndex: 'action', width: '150px'},
])
//加载完组件后，开始查询数据，用于显示
onMounted(() => search())
//查询数据集，赋值给上面的data
const search = () => {
  relatedPartyApi.getList(queryCondition).then(
      (res) => {
        data.dataList = res.data
        data.totalPages = res.paging.number_of_pages
        data.totalRecords = res.paging.number_of_records
      },
  )
}
//当页码或单页数据条数发生变化时，更新查询条件，重新查询
const paginationChange = (page: number, pageSize: number) => {
  queryCondition.page = page
  queryCondition.page_size = pageSize
  search()
}
//重置所有的查询条件，重新查询
const reset = () => {
  queryCondition.chinese_name_include = ''
  queryCondition.english_name_include = ''
  queryCondition.page = 1
  queryCondition.page_size = 12
  search()
}
//用于修改单条信息的抽屉是否可见
const visible = ref(false)
//单条记录
let relatedParty = reactive({
  id: 0,
  chineseName: '',
  englishName: '',
  address: '',
  uniformSocialCreditCode: '',
  telephone: '',
})

//查看单条记录的详情
function detail(id: number) {
  message.success('数据记录id为：' + id + '，等待完善', 2)
}

//打开抽屉，开启修改单条信息的界面
const updateRecord = (id: number) => {
  visible.value = true
  relatedPartyApi.get({id:id}).then(
      res => {
        relatedParty.id = res.data.id
        relatedParty.chineseName = res.data.chinese_name
        relatedParty.englishName = res.data.english_name
        relatedParty.uniformSocialCreditCode = res.data.uniform_social_credit_code
      }
  )
}
//关闭抽屉
const cancel = () => visible.value = false
//确认修改，发送更新请求
const confirm = (id: number, params: any) => {
  //这里还需要对返回结果进行判断后再处理，只是验证了模型能跑通
  visible.value = false
  message.success('修改成功', 2)
  relatedPartyApi.update({
    id:id,
    chinese_name: relatedParty.chineseName,
    english_name: relatedParty.englishName,
    address: relatedParty.address,
    uniform_social_credit_code: relatedParty.uniformSocialCreditCode,
    telephone: relatedParty.telephone,
  }).then(
      () => relatedPartyApi.getList(queryCondition).then(
          (res) => {
            data.dataList = res.data
            data.totalPages = res.paging.total_pages
            data.totalRecords = res.paging.total_records
          },
      ))
}

//删除单条记录
function deleteRecord(id: number) {
  relatedPartyApi.delete({id:id}).then(
      res => {
        //这里还需要对返回结果进行判断后再处理，只是验证了模型能跑通
        message.success('删除成功', 2)
        relatedPartyApi.getList(queryCondition).then(
            (res) => {
              data.dataList = res.data
              data.totalPages = res.paging.total_pages
              data.totalRecords = res.paging.total_records
            },
        )
      }
  )
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

//表格内容居中
:deep(.ant-table) {
  th.chinese_name, td.chinese_name, th.english_name, td.english_name,
  th.uniform_social_credit_code, td.uniform_social_credit_code,
  th.action, td.action,
  th.button, td.button {
    text-align: center;
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
