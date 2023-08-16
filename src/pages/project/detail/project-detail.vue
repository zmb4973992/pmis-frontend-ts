<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
  <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-page-header :title="projectDetail.name">
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="项目金额">
          {{ projectDetail.amount.toLocaleString() }} {{ projectDetail.currency.name }}
        </a-descriptions-item>
        <a-descriptions-item label="项目编号">{{ projectDetail.code }}</a-descriptions-item>
        <a-descriptions-item label="签约对方">{{ projectDetail.related_party.chinese_name }}</a-descriptions-item>
        <a-descriptions-item label="我方签约主体">{{ projectDetail.our_signatory.name }}</a-descriptions-item>
        <a-descriptions-item label="项目类型">{{ projectDetail.type.name }}</a-descriptions-item>
        <a-descriptions-item label="签约日期">{{ projectDetail.signing_date }}</a-descriptions-item>
        <a-descriptions-item label="生效日期">{{ projectDetail.effective_date }}</a-descriptions-item>
      </a-descriptions>
    </a-page-header>
  </a-card>

  <a-card size="small" :bordered="false"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-tabs >
      <a-tab-pane key="working-progress" tab="工作进度">
        <working-progress :project-id="projectID"/>
      </a-tab-pane>
      <a-tab-pane key="cash-flow" tab="现金流">
        <cash-flow :project-id="projectID"/>
      </a-tab-pane>
      <a-tab-pane key="income" tab="收款情况">
        <income :project-id="projectID"/>
      </a-tab-pane>
      <a-tab-pane key="expenditure" tab="付款情况">
        <expenditure :project-id="projectID"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
  </a-spin>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {projectApi} from "@/api/project";
import WorkingProgress from "@/pages/project/detail/component/working-progress.vue";
import CashFlow from "@/pages/project/detail/component/cash-flow.vue";
import Income from "@/pages/project/detail/component/income.vue";
import Expenditure from "@/pages/project/detail/component/expenditure.vue";

const loading = ref(true)

interface projectDetailFormat {
  name: string
  code: string
  country: string
  signing_date: string,
  effective_date: string,
  commissioning_date: string,
  content: string,
  amount: number,
  currency: { name: string },
  our_signatory: { name: string },
  type: { name: string }
  related_party: { chinese_name: string }
  organization: { name: string }
}

let projectDetail = reactive<projectDetailFormat>({
  name: '',
  code: '',
  country: '',
  signing_date: '',
  effective_date: '',
  commissioning_date: '',
  content: '',
  amount: 0,
  currency: {name: ''},
  our_signatory: {name: ''},
  type: {name: ''},
  related_party: {chinese_name: ''},
  organization: {name: ''},
})

const route = useRoute()

const projectID = ref(Number(route.params.projectID))

if (projectID) {
  getProjectDetail(projectID.value)
}

const router = useRouter()

async function getProjectDetail(projectID: number) {
  try {
    const res = await projectApi.get({id: projectID})
    if (res?.code === 0) {
      projectDetail.name = res.data.name
      projectDetail.code = res.data.code
      projectDetail.related_party.chinese_name = res.data.related_party?.chinese_name
      projectDetail.type.name = res.data.type?.name
      projectDetail.country = res.data.country
      projectDetail.amount = res.data.amount
      projectDetail.currency.name = res.data.currency?.name
      projectDetail.organization.name = res.data.organization?.name
      projectDetail.signing_date = res.data.signing_date
      projectDetail.effective_date = res.data.effective_date
    } else if (res?.code === 403) {
      await router.push({name:'403'})
    } else if (res?.code === 404) {
      await router.push({name:'404'})
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false
  }
}

</script>

<style lang="scss">
#project_amount {
  //text-align: right;
  width: 120px;
}
</style>
