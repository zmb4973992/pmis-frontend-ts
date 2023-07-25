<template>
  <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-page-header :title="relatedPartyDetail.name">
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="统一社会信用代码">{{
            relatedPartyDetail.uniformSocialCreditCode
          }}
        </a-descriptions-item>
        <a-descriptions-item label="地址">{{ relatedPartyDetail.address }}</a-descriptions-item>
        <a-descriptions-item label="英文名称">{{ relatedPartyDetail.englishName }}</a-descriptions-item>
        <a-descriptions-item label="电话">{{ relatedPartyDetail.telephone }}</a-descriptions-item>
        <a-descriptions-item label="项目金额">{{ relatedPartyDetail.remarks }}</a-descriptions-item>
      </a-descriptions>
    </a-page-header>
  </a-card>

  <a-card size="small" :bordered="false" style="margin-bottom: 10px"
          :body-style="{padding:'0 10px 10px 10px'}">
    <a-tabs>
      <a-tab-pane key="project" tab="项目">
        <project-table :related-party-id="Number(route.params.relatedPartyID)"/>
      </a-tab-pane>
      <a-tab-pane key="contract" tab="合同">
        <contract-table :related-party-id="Number(route.params.relatedPartyID)"/>
      </a-tab-pane>

    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {relatedPartyApi} from "@/api/related-party";
import {message} from "ant-design-vue";
import ProjectTable from "@/pages/related-party/detail/component/project-table.vue";
import ContractTable from "@/pages/related-party/detail/component/contract-table.vue";


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

let relatedPartyDetail = reactive({
  name: '',
  englishName: '',
  uniformSocialCreditCode: '',
  address: '',
  telephone: '',
  remarks: '',
})

const route = useRoute()

const relatedPartyID = ref(Number(route.params.relatedPartyID))

if (relatedPartyID) {
  getRelatedPartyDetail(relatedPartyID.value)
}


async function getRelatedPartyDetail(relatedPartyID: number) {
  try {
    const res = await relatedPartyApi.get({id: relatedPartyID})
    if (res.code === 0) {
      relatedPartyDetail.name = res.data.name
      relatedPartyDetail.englishName = res.data.english_name
      relatedPartyDetail.uniformSocialCreditCode = res.data.uniform_social_credit_code
      relatedPartyDetail.address = res.data.address
      relatedPartyDetail.telephone = res.data.telephone
      relatedPartyDetail.remarks = res.data.telephone
    }
  } catch (e: any) {
    message.error(e)
  }

}

</script>

<style lang="scss">
#project_amount {
  //text-align: right;
  width: 120px;
}
</style>
