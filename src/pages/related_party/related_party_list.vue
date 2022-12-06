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

  <!--表格主体-->
  <a-table :data-source="data.dataList" :columns="columns"
           :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
           size="small" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">

        <a>详情</a>
        <a-divider type="vertical"/>
        <a @click="update(record.id)">修改</a>
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
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onClose">确认</a-button>
    </template>
    <a-input placeholder="中文名称" style="margin-bottom: 15px" v-model:value="relatedParty.chineseName"></a-input>
    <a-input placeholder="英文名称" style="margin-bottom: 15px" v-model:value="relatedParty.englishName"></a-input>
    <a-input placeholder="统一社会信用代码" style="margin-bottom: 15px" v-model:value="relatedParty.uniformSocialCreditCode"></a-input>
  </a-drawer>
</template>

<script setup lang="ts">
import {SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
import {DeleteRelatedParty, GetRelatedParty} from "@/api/related_party";


import {onMounted, reactive, ref} from "vue";
import {GetRelatedPartyList} from "@/api/related_party";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

const pageSizeOptions = ['12', '20', '25', '30']

const queryCondition = reactive({
  page: 1, page_size: 12, chinese_name_include: '', english_name_include: '',
})

let data = reactive({
  dataList: [], totalPages: 1, totalRecords: 1,
})

let columns = ref([
  {title: '中文名称', dataIndex: 'chinese_name', className: 'chinese_name'},
  {title: '英文名称', dataIndex: 'english_name', className: 'english_name', width: '10%', ellipsis: true},
  {title: '统一社会信用代码', className: 'uniform_social_credit_code', dataIndex: 'uniform_social_credit_code'},
  {title: '操作', className: 'action', dataIndex: 'action', width: '150px'},
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

const visible = ref(false)

let relatedParty = reactive({
  chineseName: '',
  englishName: '',
  uniformSocialCreditCode:'',
})


const update = (id: number) => {
  visible.value = true
  GetRelatedParty(id).then(
      res => {
        relatedParty.chineseName = res.data.chinese_name
        relatedParty.englishName = res.data.english_name
        relatedParty.uniformSocialCreditCode = res.data.uniform_social_credit_code
      }
  )
}


const onClose = () => visible.value = false

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
