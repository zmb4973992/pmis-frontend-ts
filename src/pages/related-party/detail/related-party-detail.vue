<template>
  <a-spin :spinning="loading" size="large" tip="加载中，请稍等......">
    <a-card size="small" :bordered="false" style="margin-bottom: 10px;"
            :body-style="{padding:'0 10px 0 10px'}">
      <a-page-header :title="relatedPartyDetail.name">
        <a-descriptions size="small" :column="3">
          <a-descriptions-item label="统一社会信用代码">
            {{ relatedPartyDetail.uniformSocialCreditCode }}
          </a-descriptions-item>

          <a-descriptions-item label="地址">
            {{ relatedPartyDetail.address }}
          </a-descriptions-item>

          <a-descriptions-item label="英文名称">
            {{ relatedPartyDetail.englishName }}
          </a-descriptions-item>

          <a-descriptions-item label="电话">
            {{ relatedPartyDetail.telephone }}
          </a-descriptions-item>

          <a-descriptions-item label="备注">
            {{ relatedPartyDetail.remarks }}
          </a-descriptions-item>

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
  </a-spin>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {relatedPartyApi} from "@/api/related-party";
import ProjectTable from "@/pages/related-party/detail/component/project-table.vue";
import ContractTable from "@/pages/related-party/detail/component/contract-table.vue";

const loading = ref(true)

interface relatedPartyDetailFormat {
  name?: string,
  englishName?: string,
  uniformSocialCreditCode?: string,
  address?: string,
  telephone?: string,
  remarks?: string,
}

let relatedPartyDetail = reactive<relatedPartyDetailFormat>({})

//获取路由信息
const route = useRoute()

//从路由获取相关方ID
const relatedPartyID = ref(Number(route.params.relatedPartyID))

if (relatedPartyID) {
  getRelatedPartyDetail(relatedPartyID.value)
}

const router = useRouter()

async function getRelatedPartyDetail(relatedPartyID: number) {
  try {
    const res = await relatedPartyApi.get({id: relatedPartyID})
    if (res.code === 0) {
      relatedPartyDetail.name = res.data.name
      relatedPartyDetail.englishName = res.data.english_name
      relatedPartyDetail.uniformSocialCreditCode = res.data.uniform_social_credit_code
      relatedPartyDetail.address = res.data.address
      relatedPartyDetail.telephone = res.data.telephone
      relatedPartyDetail.remarks = res.data.remarks
    } else if (res?.code === 403) {
      await router.push({name: '403'})
    } else if (res?.code === 404) {
      await router.push({name: '404'})
    }
  } catch (e: any) {
    console.log(e);
  }  finally {
    loading.value = false
  }
}

</script>

<style lang="scss">

</style>
