<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
    <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
            :body-style="{padding:'0 10px 0 10px'}">
      <a-page-header :title="contractDetail.name">
        <a-descriptions size="small" :column="3">
          <a-descriptions-item label="合同金额">
            {{ contractDetail.amount?.toLocaleString() }}&nbsp;{{ contractDetail.currencyName }}
          </a-descriptions-item>

          <a-descriptions-item label="合同编号">
            {{ contractDetail.code }}
          </a-descriptions-item>

          <a-descriptions-item label="资金方向">
            {{ contractDetail.fundDirectionName }}
          </a-descriptions-item>

          <a-descriptions-item label="签约对方">
            {{ contractDetail.relatedPartyName }}
          </a-descriptions-item>

          <a-descriptions-item label="我方签约主体">
            {{ contractDetail.ourSignatoryName }}
          </a-descriptions-item>

          <a-descriptions-item label="合同类型">
            {{ contractDetail.typeName }}
          </a-descriptions-item>

          <a-descriptions-item label="签约日期">
            {{ contractDetail.signingDate }}
          </a-descriptions-item>

          <a-descriptions-item label="生效日期">
            {{ contractDetail.effectiveDate }}
          </a-descriptions-item>

          <a-descriptions-item label="操作人">
            {{ contractDetail.operator }}
          </a-descriptions-item>

          <a-descriptions-item label="附件">
            <span v-if="!contractDetail.files?.length"></span>
            <a-list v-else size="small" :bordered="false" :split="false"
                    :data-source="contractDetail.files">
              <template #renderItem="{item}">
                <a-list-item style="padding-top: 0">
                  <a target="_blank" :href="item.url">{{ item.name }}</a>
                  <span style="margin-left: 20px">{{ item.size_mb }} MB</span>
                </a-list-item>
              </template>
            </a-list>
          </a-descriptions-item>
        </a-descriptions>
      </a-page-header>
    </a-card>

    <a-card size="small" :bordered="false" style="margin-bottom: 10px"
            :body-style="{padding:'0 10px 10px 10px'}">
      <a-tabs>
        <a-tab-pane key="cash-flow" tab="现金流">
          <cash-flow :contract-id="contractID"/>
        </a-tab-pane>
        <a-tab-pane key="expenditure-progress" tab="付款进度曲线">
          <expenditure-progress :contract-id="contractID"/>
        </a-tab-pane>
        <a-tab-pane key="income-progress" tab="收款进度曲线">
          <income-progress :contract-id="contractID"/>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import CashFlow from "@/pages/contract/detail/component/cash-flow.vue";
import {contractApi} from "@/api/contract";
import ExpenditureProgress from "@/pages/contract/detail/component/expenditure-progress.vue";
import IncomeProgress from "@/pages/contract/detail/component/income-progress.vue";
import router from "@/router";

const loading = ref(true)

interface contractDetailFormat {
  name?: string
  code?: string
  signingDate?: string,
  effectiveDate?: string,
  commissioningDate?: string,
  content?: string,
  amount?: number,
  operator?: string,
  projectName?: string,
  fundDirectionName?: string,
  currencyName?: string,
  ourSignatoryName?: string,
  typeName?: string,
  relatedPartyName?: string,
  organizationName?: string,
  files?: { name: string, url: string, size_mb: number }[]
}

let contractDetail = reactive<contractDetailFormat>({})

//获取路由信息
const route = useRoute()

//从路由获取合同ID
const contractID = ref(Number(route.params.contractID))

if (contractID) {
  getContractDetail(contractID.value)
}


async function getContractDetail(contractID: number) {
  try {
    const res = await contractApi.get({id: contractID})
    if (res?.code === 0) {
      contractDetail.name = res.data.name
      contractDetail.code = res.data.code
      contractDetail.operator = res.data.operator
      contractDetail.relatedPartyName = res.data.related_party?.name
      contractDetail.typeName = res.data.type?.name
      contractDetail.amount = res.data.amount
      contractDetail.currencyName = res.data.currency?.name
      contractDetail.organizationName = res.data.organization?.name
      contractDetail.signingDate = res.data.signing_date
      contractDetail.effectiveDate = res.data.effective_date
      contractDetail.fundDirectionName = res.data.fund_direction?.name
      contractDetail.ourSignatoryName = res.data.our_signatory?.name
      contractDetail.files = []
      for (const file of res.data.files) {
        contractDetail.files.push({
              name: file.name,
              url: file.url,
              size_mb: file.size_mb,
            }
        )
      }
    } else if (res?.code === 403) {
      await router.push({name: '403'})
    } else if (res?.code === 404) {
      await router.push({name: '404'})
    }
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false
  }
}

</script>

<style lang="scss">

</style>
