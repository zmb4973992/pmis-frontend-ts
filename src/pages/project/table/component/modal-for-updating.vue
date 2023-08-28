<template>
  <a-modal v-model:visible="modalVisible" :after-close="resetForm" title="修改项目信息"
           width="600px" @ok="onSubmit" :destroy-on-close="true">
    <a-spin :spinning="formLoading">
      <a-form ref="form" :model="projectDetail" :label-col="{ span:4 }">
        <a-form-item label="项目名称" name="name">
          {{ projectDetail.name }}
        </a-form-item>

        <a-form-item label="项目编号" name="code">
          {{ projectDetail.code }}
        </a-form-item>

        <a-form-item label="所属部门" name="organizationID"
                     :rules="{required: true, message: '请填写所属部门'}">
          <a-select v-model:value="projectDetail.organizationID" :options="organizationOptions"/>
        </a-form-item>

        <a-form-item label="项目类型" name="type"
                     :rules="{required: true, message: '请选择项目类型'}">
          <a-select v-model:value="projectDetail.type" :options="projectTypeOptions"/>
        </a-form-item>

        <a-form-item label="所在国家" name="country"
                     :rules="{required: true, message: '请填写所在国家'}">
          <a-select v-model:value="projectDetail.country" :options="countryOptions" show-search
                    :filter-option="countryFilterOption"/>
        </a-form-item>

        <a-form-item label="项目金额" name="amount"
                     :rules="{required: true, message: '请填写项目金额'}">
          <a-input-number id="project_amount" v-model:value="projectDetail.amount" :min="0"
                          :controls="false" :precision="2" style="width: 260px">
            <template #addonAfter style="width: 150px">
              <a-select id="project_currency" v-model:value="projectDetail.currency"
                        :options="currencyOptions" style="width:120px"/>
            </template>
          </a-input-number>
        </a-form-item>

        <a-form-item v-if="exchangeRateVisible" label="汇率" name="exchangeRate"
                     :rules="{required: true, message: '请填写汇率'}">
          <a-input-number v-model:value="projectDetail.exchangeRate" :min="0" :controls="false"
                          :precision="4"/>

          <a-tooltip>
            <template #title>
              <div>这里填写1元外币 = XX 元人民币。</div>
              <div>比如1美元 = 7元人民币，则填7；</div>
              <div>比如1日元 = 0.05元人民币，则填0.05</div>
            </template>
            <QuestionCircleOutlined style="margin-left:10px;font-size: 18px"/>
          </a-tooltip>
        </a-form-item>

        <a-form-item label="项目状态" name="status"
                     :rules="{required: true, message: '请选择项目状态'}">
          <a-select v-model:value="projectDetail.status" :options="statusOptions"/>
        </a-form-item>

        <a-form-item label="业主名称" name="relatedPartyID">
          <a-select v-model:value="projectDetail.relatedPartyID" :options="relatedPartyOptions"
                    show-search allow-clear :filter-option="relatedPartyFilterOption"/>
        </a-form-item>

        <a-form-item label="我方主体" name="ourSignatory">
          <a-select v-model:value="projectDetail.ourSignatory" allow-clear
                    :options="ourSignatoryOptions"/>
        </a-form-item>

        <a-form-item label="约定工期" name="constructionPeriod">
          <a-input-number v-model:value="projectDetail.constructionPeriod" style="width: 120px"
                          :controls="false">
            <template #addonAfter>
              <span>天</span>
            </template>
          </a-input-number>
        </a-form-item>

        <a-form-item label="签约日期" name="signingDate">
          <a-date-picker v-model:value="projectDetail.signingDate">
          </a-date-picker>
        </a-form-item>

        <a-form-item label="生效日期" name="effectiveDate">
          <a-date-picker v-model:value="projectDetail.effectiveDate">
          </a-date-picker>
        </a-form-item>

        <a-form-item label="工作内容" name="content">
          <a-textarea v-model:value="projectDetail.content" placeholder="请输入工作内容"
                      :rows="5">
          </a-textarea>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {FormInstance, message, SelectProps} from "ant-design-vue";
import {projectApi} from "@/api/project";
import {dictionaryDetailApi} from "@/api/dictionary-detail";
import dayjs, {Dayjs} from "dayjs";
import {organizationApi} from "@/api/organization";
import {relatedPartyApi} from "@/api/related-party";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";

interface projectDetailFormat {
  id: number,
  name?: string,
  code?: string,
  country?: number,
  type?: number,
  amount?: number,
  currency?: number,
  exchangeRate?: number,
  organizationID?: number,
  relatedPartyID?: number,
  status?: number,
  signingDate?: Dayjs,
  effectiveDate?: Dayjs,
  ourSignatory?: number,
  constructionPeriod?: number,
  content?: string,
}

const projectDetail = reactive<projectDetailFormat>({
  id: 0,
})

const formLoading = ref(true)

const countryOptions = ref<SelectProps['options']>([])
const projectTypeOptions = ref<SelectProps['options']>([])

const currencyOptions = ref<SelectProps['options']>()
//人民币的id
const CNY = ref<number>()
//监听币种的变化，如果是人民币，就隐藏汇率
//如果不是人民币，就显示汇率
watch(() => projectDetail.currency, (newValue) => {
      if (newValue === CNY.value) {
        exchangeRateVisible.value = false
        projectDetail.exchangeRate = 1
      } else {
        exchangeRateVisible.value = true
      }
    }
)
//汇率框是否显示
const exchangeRateVisible = ref(false)

const organizationOptions = ref<SelectProps['options']>()
const statusOptions = ref<SelectProps['options']>()

const relatedPartyOptions = ref<SelectProps['options']>()
const relatedPartyFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

const ourSignatoryOptions = ref<SelectProps['options']>()

const countryFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

//弹窗是否显示
const modalVisible = ref(false)

const form = ref<FormInstance>()

//重置表单
function resetForm() {
  //数据尽可能放在form里，但也要记得修改不在reactive里的数据
  Object.keys(projectDetail).map(key => {
    delete projectDetail[key as keyof typeof projectDetail]
  })
}

const emit = defineEmits(['loadTableData'])

async function showModal(projectID: number) {
  try {
    modalVisible.value = true
    formLoading.value = true

    const res1 = await dictionaryDetailApi.getList({dictionary_type_name: "国家", page_size: 0})
    if (res1?.code === 0) {
      countryOptions.value = []
      for (let item of res1.data) {
        countryOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res1.message)
    }

    const res2 = await dictionaryDetailApi.getList({dictionary_type_name: "项目类型", page_size: 0})
    if (res2?.code === 0) {
      projectTypeOptions.value = []
      for (let item of res2.data) {
        projectTypeOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res2.message)
    }

    const res3 = await dictionaryDetailApi.getList({dictionary_type_name: "币种", page_size: 0})
    if (res3?.code === 0) {
      currencyOptions.value = []
      for (let item of res3.data) {
        currencyOptions.value.push({value: item.id, label: item.name})
        if (item.name === '人民币') {
          CNY.value = item.id
        }
      }
    } else {
      console.log(res3.message)
    }

    const res4 = await dictionaryDetailApi.getList({dictionary_type_name: "项目状态", page_size: 0})
    if (res4?.code === 0) {
      statusOptions.value = []
      for (let item of res4.data) {
        statusOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res4.message)
    }

    const res5 = await organizationApi.getList({is_valid: true, page_size: 0})
    if (res5?.code === 0) {
      organizationOptions.value = []
      for (let item of res5.data) {
        organizationOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res5.message)
    }

    const res6 = await relatedPartyApi.getList({page_size: 0})
    if (res6?.code === 0) {
      relatedPartyOptions.value = []
      for (let item of res6.data) {
        relatedPartyOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res6.message)
    }

    const res7 = await dictionaryDetailApi.getList({dictionary_type_name: "我方签约主体", page_size: 0})
    if (res7?.code === 0) {
      ourSignatoryOptions.value = []
      for (let item of res7.data) {
        ourSignatoryOptions.value.push({value: item.id, label: item.name}
        )
      }
    } else {
      console.log(res7.message)
    }

    const res = await projectApi.get({id: projectID})
    if (res.code === 0) {
      projectDetail.id = projectID
      projectDetail.code = res.data?.code
      projectDetail.name = res.data?.name
      projectDetail.country = res.data?.country?.id
      projectDetail.type = res.data?.type?.id
      projectDetail.amount = res.data?.amount
      projectDetail.currency = res.data?.currency?.id
      projectDetail.exchangeRate = res.data?.exchange_rate
      projectDetail.status = res.data?.status?.id
      projectDetail.ourSignatory = res.data?.our_signatory?.id
      projectDetail.constructionPeriod = res.data?.construction_period
      projectDetail.organizationID = res.data?.organization?.id
      projectDetail.relatedPartyID = res.data?.related_party?.id
      projectDetail.signingDate = res.data?.signing_date ? dayjs(res.data.signing_date) : undefined
      projectDetail.effectiveDate = res.data?.effective_date ? dayjs(res.data.effective_date) : undefined
      projectDetail.content = res.data?.content
    } else {
      console.log(res.message)
    }
  } catch (e: any) {
    console.log(e)
  } finally {
    formLoading.value = false
  }
}

function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        try {
          const res = await projectApi.update({
            id: projectDetail.id,
            code: projectDetail.code,
            name: projectDetail.name,
            country: projectDetail.country ? projectDetail.country : -1,
            type: projectDetail.type ? projectDetail.type : -1,
            amount: projectDetail.amount ? projectDetail.amount : 0,
            currency: projectDetail.currency ? projectDetail.currency : -1,
            exchange_rate: projectDetail.exchangeRate ? projectDetail.exchangeRate : -1,
            status: projectDetail.status ? projectDetail.status : -1,
            our_signatory: projectDetail.ourSignatory ? projectDetail.ourSignatory : -1,
            construction_period: projectDetail.constructionPeriod ? projectDetail.constructionPeriod : -1,
            organization_id: projectDetail.organizationID ? projectDetail.organizationID : -1,
            related_party_id: projectDetail.relatedPartyID ? projectDetail.relatedPartyID : -1,
            content: projectDetail.content,
            signing_date: projectDetail.signingDate?.format("YYYY-MM-DD") || "",
            effective_date: projectDetail.effectiveDate?.format("YYYY-MM-DD") || "",
          })

          if (res?.code === 0) {
            message.success('修改成功')
            emit('loadTableData')
          } else {
            message.error(res.message)
          }
        } catch (e: any) {
          console.log(e);
        } finally {
          modalVisible.value = false
        }
      }
  )
}

defineExpose({showModal,})

</script>

<style scoped lang="scss">

</style>
