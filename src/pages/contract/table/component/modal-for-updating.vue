<template>
  <a-modal v-model:visible="modalVisible" :after-close="resetForm" title="修改合同信息"
           width="600px" @ok="onSubmit" :destroy-on-close="true">
    <a-spin :spinning="formLoading">
      <a-form ref="form" :model="contractDetail" :label-col="{span:4}">
        <a-form-item label="合同名称" name="name">
          {{ contractDetail.name }}
        </a-form-item>

        <a-form-item label="合同编号" name="code">
          {{ contractDetail.code }}
        </a-form-item>

        <a-form-item name="projectName" label="项目名称">
          {{ contractDetail.projectName }}
        </a-form-item>

        <a-form-item name="relatedPartyID" label="对方名称"
                     :rules="{required: true, message: '请选择对方名称'}">
          <a-select v-model:value="contractDetail.relatedPartyID"
                    :options="relatedPartyOptions" show-search
                    :filter-option="relatedPartyFilterOption"
          />
        </a-form-item>

        <a-form-item name="fundDirection" label="资金方向"
                     :rules="{required: true, message: '请选择资金方向'}">
          <a-select v-model:value="contractDetail.fundDirection"
                    :options="fundDirectionOptions"
          />
        </a-form-item>

        <a-form-item name="ourSignatory" label="签约主体"
                     :rules="{required: true, message: '请选择我方签约主体'}">
          <a-select v-model:value="contractDetail.ourSignatory"
                    :options="ourSignatoryOptions"/>
        </a-form-item>

        <a-form-item name="amount" label="合同金额"
                     :rules="{required: true, message: '请填写合同金额'}">
          <a-input-number v-model:value="contractDetail.amount" :min="0"
                          :controls="false" :precision="2" style="width: 260px">
            <template #addonAfter style="width: 150px">
              <a-select v-model:value="contractDetail.currency"
                        :options="currencyOptions" style="width:120px"/>
            </template>
          </a-input-number>
        </a-form-item>

        <a-form-item v-if="exchangeRateVisible" name="exchangeRate" label="汇率"
                     :rules="{required: true, message: '请填写汇率'}">
          <a-input-number v-model:value="contractDetail.exchangeRate" :min="0"
                          :controls="false" :precision="4"/>
          <a-tooltip>
            <template #title>
              <div>这里填写1元外币 = XX 元人民币。</div>
              <div>比如1美元 = 7元人民币，则填7；</div>
              <div>比如1日元 = 0.05元人民币，则填0.05</div>
            </template>
            <QuestionCircleOutlined style="margin-left:10px;font-size: 18px"/>
          </a-tooltip>
        </a-form-item>

        <a-form-item name="type" label="合同类型"
                     :rules="{required: true, message: '请选择合同类型'}">
          <a-select v-model:value="contractDetail.type" show-search
                    :options="typeOptions"/>
        </a-form-item>

        <a-form-item name="signingDate" label="签约日期">
          <a-date-picker v-model:value="contractDetail.signingDate"/>
        </a-form-item>

        <a-form-item name="effectiveDate" label="生效日期">
          <a-date-picker v-model:value="contractDetail.effectiveDate"/>
        </a-form-item>

        <a-form-item name="content" label="工作内容">
          <a-textarea v-model:value="contractDetail.content"
                      placeholder="请输入工作内容" :rows="4"/>
        </a-form-item>

        <a-form-item label="附件" name="fileIDs">
          <a-upload name="files" v-model:file-list="contractDetail.files"
                    :before-upload="beforeUpload" :custom-request="uploadFile"
                    @change="handleChange" :max-count="3">
            <a-button :disabled="uploadDisabled">
              <UploadOutlined/>
              点击上传
            </a-button>

            <div @click.stop style="display: inline-block;padding-left: 10px;">
              单个<span style="color: red">≤20MB</span>,
              最多<span style="color: red">3个</span>,
              限<span style="color: red">jpg/png/pdf</span>格式
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>

</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {relatedPartyApi} from "@/api/related-party";
import {FormInstance, message, SelectProps, Upload, UploadChangeParam, UploadProps} from "ant-design-vue";
import {fileApi} from "@/api/file";
import {contractApi} from "@/api/contract";
import {dictionaryDetailApi} from "@/api/dictionary-detail";
import dayjs from "dayjs";
import type {Dayjs} from 'dayjs';
import {QuestionCircleOutlined} from "@ant-design/icons-vue";

interface contractDetailFormat {
  id: number,
  name?: string,
  code?: string,
  projectName: string,
  organizationName: string,
  relatedPartyID?: number,
  fundDirection?: number,
  ourSignatory?: number,
  currency?: number,
  type?: number,
  signingDate?: Dayjs,
  effectiveDate?: Dayjs,
  completionDate?: string,
  amount?: number,
  exchangeRate?: number,
  content: string,
  deliverable: string,
  penaltyRule: string,
  files: any[]
}

let contractDetail = reactive<contractDetailFormat>({
  id: 0,
  name: '',
  code: '',
  projectName: '',
  organizationName: '',
  content: '',
  deliverable: '',
  penaltyRule: '',
  signingDate: undefined,
  files: [],
})

const formLoading = ref(true)

const relatedPartyOptions = ref<SelectProps['options']>()
const relatedPartyFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

const fundDirectionOptions = ref<SelectProps['options']>()
const ourSignatoryOptions = ref<SelectProps['options']>()
const currencyOptions = ref<SelectProps['options']>()

const typeOptions = ref<SelectProps['options']>()

//人民币的id
const CNY = ref<number>()
//监听币种的变化，如果是人民币，就隐藏汇率
//如果不是人民币，就显示汇率
watch(() => contractDetail.currency, (newValue) => {
      if (newValue === CNY.value) {
        exchangeRateVisible.value = false
        contractDetail.exchangeRate = 1
      } else {
        exchangeRateVisible.value = true
      }
    }
)
//汇率框是否显示
const exchangeRateVisible = ref(false)

//弹窗是否显示
const modalVisible = ref(false)

const form = ref<FormInstance>()

//重置表单
function resetForm() {
  //记得还要修改不在reactive里的数据
  Object.keys(contractDetail).map(key => {
    delete contractDetail[key as keyof typeof contractDetail]
  })
}

const emit = defineEmits(['loadTableData'])

async function showModal(contractID: number) {
  try {
    modalVisible.value = true
    formLoading.value = true

    const res1 = await relatedPartyApi.getList({page_size: 0})
    if (res1?.code === 0) {
      relatedPartyOptions.value = []
      for (let item of res1.data) {
        relatedPartyOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res1.message)
    }

    const res2 = await dictionaryDetailApi.getList({dictionary_type_name: "合同的资金方向", page_size: 0})
    if (res2?.code === 0) {
      fundDirectionOptions.value = []
      for (let item of res2.data) {
        fundDirectionOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res2.message)
    }

    const res3 = await dictionaryDetailApi.getList({
      dictionary_type_name: "我方签约主体", page_size: 0
    })
    if (res3?.code === 0) {
      ourSignatoryOptions.value = []
      for (let item of res3.data) {
        ourSignatoryOptions.value.push({value: item.id, label: item.name}
        )
      }
    } else {
      console.log(res3.message)
    }

    const res4 = await dictionaryDetailApi.getList({dictionary_type_name: "币种", page_size: 0})
    if (res4?.code === 0) {
      currencyOptions.value = []
      for (let item of res4.data) {
        currencyOptions.value.push({value: item.id, label: item.name})
        if (item.name === '人民币') {
          CNY.value = item.id
        }
      }
    } else {
      console.log(res4.message)
    }

    const res5 = await dictionaryDetailApi.getList({dictionary_type_name: "合同类型", page_size: 0})
    if (res5?.code === 0) {
      typeOptions.value = []
      for (let item of res5.data) {
        typeOptions.value.push({value: item.id, label: item.name})
      }
    } else {
      console.log(res5.message)
    }

    const res = await contractApi.get({id: contractID})
    if (res?.code === 0) {
      contractDetail.id = contractID
      contractDetail.name = res.data?.name
      contractDetail.code = res.data?.code
      contractDetail.relatedPartyID = res.data?.related_party?.id
      contractDetail.projectName = res.data?.project?.name
      contractDetail.fundDirection = res.data?.fund_direction?.id
      contractDetail.ourSignatory = res.data?.our_signatory?.id
      contractDetail.amount = res.data?.amount
      contractDetail.currency = res.data?.currency?.id
      contractDetail.exchangeRate = res.data?.exchange_rate
      contractDetail.type = res.data?.type?.id
      contractDetail.signingDate = res.data.signing_date ? dayjs(res.data.signing_date) : undefined
      contractDetail.effectiveDate = res.data.effective_date ? dayjs(res.data.effective_date) : undefined
      contractDetail.content = res.data?.content

      contractDetail.files = []
      if (res.data.files) {
        for (let item of res.data.files) {
          contractDetail.files.push({
            name: item.name + "　　" + item.size_mb + "MB",
            url: item.url,
            response: {id: item.id,}
          })
        }
      }
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
          let fileIDs: number[] = []
          for (let item of contractDetail.files) {
            if (item.response?.id) {
              fileIDs.push(item.response.id)
            }
          }

          const res = await contractApi.update({
            id: contractDetail.id,
            related_party_id: contractDetail.relatedPartyID,
            fund_direction: contractDetail.fundDirection,
            our_signatory: contractDetail.ourSignatory,
            currency: contractDetail.currency,
            type: contractDetail.type,
            signing_date: contractDetail.signingDate?.format("YYYY-MM-DD") || "",
            effective_date: contractDetail.effectiveDate?.format("YYYY-MM-DD") || "",
            amount: contractDetail.amount,
            exchange_rate: contractDetail.exchangeRate,
            content: contractDetail.content,
            file_ids: fileIDs,
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

const uploadFile: UploadProps['customRequest'] = async (options: any) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    let res = await fileApi.upload(formData)
    if (res.code !== 0) {
      message.error(res.message)
      options.onError(res.message)
    } else {
      options.onSuccess(res.data, options.file)
    }
  } catch (e: any) {
    message.error(e)
  }
}

function handleChange(info: UploadChangeParam) {
  let resFileList = [...info.fileList]

  resFileList = resFileList.map(file => {
        if (file.response) {
          file.url = file.response?.url
        }
        return file
      }
  )

  contractDetail.files = resFileList
}

function beforeUpload(file: any) {
  const isPermittedSize = file.size / 1024 / 1024 < 20
  if (!isPermittedSize) {
    message.error("上传的文件必须小于20MB")
  }

  const isPermittedFormat =
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'application/pdf'

  if (!isPermittedFormat) {
    message.error("只支持jpg/png/pdf格式的文件");
  }

  return (isPermittedSize && isPermittedFormat) || Upload.LIST_IGNORE
}

const uploadDisabled = ref(false)

//监听上传文件，如果数量超过2个，则禁用上传按钮
watch(() => contractDetail.files, () => {
  uploadDisabled.value = contractDetail.files?.length > 2;
})

defineExpose({showModal,})
</script>

<style scoped lang="scss">

</style>
