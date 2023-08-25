<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
    <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
            :body-style="{padding:'0 10px 0 10px'}">
      <a-page-header :title="projectDetail.name">
        <a-descriptions size="small" :column="3">
          <a-descriptions-item label="项目金额">
            {{ projectDetail.amount?.toLocaleString() }} {{ projectDetail.currencyName }}
          </a-descriptions-item>

          <a-descriptions-item label="项目编号">
            {{ projectDetail.code }}
          </a-descriptions-item>

          <a-descriptions-item label="签约对方">
            {{ projectDetail.relatedPartyName }}
          </a-descriptions-item>

          <a-descriptions-item label="我方签约主体">
            {{ projectDetail.ourSignatoryName }}
          </a-descriptions-item>

          <a-descriptions-item label="项目类型">
            {{ projectDetail.typeName }}
          </a-descriptions-item>

          <a-descriptions-item label="签约日期">
            {{ projectDetail.signingDate }}
          </a-descriptions-item>

          <a-descriptions-item label="生效日期">
            {{ projectDetail.effectiveDate }}
          </a-descriptions-item>

        </a-descriptions>
      </a-page-header>
    </a-card>

    <a-card size="small" :bordered="false"
            :body-style="{padding:'0 10px 10px 10px'}">
      <a-tabs>
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
import Income from "@/pages/project/detail/component/income.vue"
import CashFlow from "@/pages/project/detail/component/cash-flow.vue";
import Expenditure from "@/pages/project/detail/component/expenditure.vue";

const loading = ref(true)

interface projectDetailFormat {
  name?: string
  code?: string
  country?: string
  signingDate?: string,
  effectiveDate?: string,
  commissioningDate?: string,
  content?: string,
  amount?: number,
  currencyName?: string,
  ourSignatoryName?: string,
  typeName?: string,
  relatedPartyName?: string,
  organizationName?: string,
}

let projectDetail = reactive<projectDetailFormat>({})

//获取路由信息
const route = useRoute()

//从路由获取项目ID
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
      projectDetail.relatedPartyName = res.data.related_party?.name
      projectDetail.typeName = res.data.type?.name
      projectDetail.country = res.data.country
      projectDetail.amount = res.data.amount
      projectDetail.currencyName = res.data.currency?.name
      projectDetail.organizationName = res.data.organization?.name
      projectDetail.signingDate = res.data.signing_date
      projectDetail.effectiveDate = res.data.effective_date
      projectDetail.ourSignatoryName = res.data.our_signatory.name
    } else if (res?.code === 403) {
      await router.push({name: '403'})
    } else if (res?.code === 404) {
      await router.push({name: '404'})
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false
  }
}

</script>

<style lang="scss">

</style>
