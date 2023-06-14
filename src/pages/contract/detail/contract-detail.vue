<template>
  <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-page-header :title="contractDetail.name">
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="合同编号">{{ contractDetail.code }}</a-descriptions-item>
        <a-descriptions-item label="签约对方">{{ contractDetail.related_party.chinese_name }}</a-descriptions-item>
        <a-descriptions-item label="我方签约主体">{{ contractDetail.our_signatory.name }}</a-descriptions-item>
        <a-descriptions-item label="合同类型">{{ contractDetail.type.name }}</a-descriptions-item>
        <a-descriptions-item label="合同金额">
          {{ contractDetail.amount }}&nbsp;{{ contractDetail.currency.name }}
        </a-descriptions-item>
        <a-descriptions-item label="签约日期">{{ contractDetail.signing_date }}</a-descriptions-item>
        <a-descriptions-item label="生效日期">{{ contractDetail.effective_date }}</a-descriptions-item>
        <a-descriptions-item label="操作人">{{ contractDetail.operator }}</a-descriptions-item>

      </a-descriptions>
    </a-page-header>
  </a-card>

  <a-card size="small" :bordered="false" style="margin-bottom: 10px"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-tabs>
      <a-tab-pane v-if="contractDetail.fund_direction.name === '付款'"
                  key="expenditure-progress" tab="付款进度曲线">
        <expenditure-progress :contract-id="contractID"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {projectApi} from "@/api/project";
import WorkingProgress from "@/pages/project/detail/component/working-progress.vue";
import CashFlow from "@/pages/project/detail/component/cash-flow.vue";
import Income from "@/pages/project/detail/component/income.vue";
import Expenditure from "@/pages/project/detail/component/expenditure.vue";
import {contractApi} from "@/api/contract";
import ExpenditureProgress from "@/pages/contract/detail/component/expenditure-progress.vue";


interface contractDetailFormat {
  name: string
  code: string
  signing_date: string,
  effective_date: string,
  commissioning_date: string,
  content: string,
  amount: number,
  operator: string,
  project: { name: string },
  fund_direction: { name: string },
  currency: { name: string },
  our_signatory: { name: string },
  type: { name: string }
  related_party: { chinese_name: string }
  organization: { name: string }
}

let contractDetail = reactive<contractDetailFormat>({
  name: '',
  code: '',
  signing_date: '',
  effective_date: '',
  commissioning_date: '',
  content: '',
  amount: 0,
  operator: '',
  project: {name: ''},
  fund_direction: {name: ''},
  currency: {name: ''},
  our_signatory: {name: ''},
  type: {name: ''},
  related_party: {chinese_name: ''},
  organization: {name: ''},
})

const route = useRoute()

const contractID = ref(Number(route.params.contractID))

if (contractID) {
  getContractDetail(contractID.value)
}


async function getContractDetail(contractID: number) {
  const res = await contractApi.get({id: contractID})
  if (res?.code === 0) {
    contractDetail.name = res.data.name
    contractDetail.code = res.data.code
    contractDetail.operator = res.data.operator
    contractDetail.related_party.chinese_name = res.data.related_party?.chinese_name
    contractDetail.type.name = res.data.type?.name
    contractDetail.amount = res.data.amount
    contractDetail.currency.name = res.data.currency?.name
    contractDetail.organization.name = res.data.organization?.name
    contractDetail.signing_date = res.data.signing_date
    contractDetail.effective_date = res.data.effective_date
    contractDetail.fund_direction.name = res.data.fund_direction?.name
  }
}

</script>

<style lang="scss">
#project_amount {
  //text-align: right;
  width: 120px;
}
</style>
