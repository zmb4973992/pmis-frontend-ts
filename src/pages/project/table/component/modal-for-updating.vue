<template>
  <a-modal v-model:visible="visible" :after-close="resetForm" title="修改"
           width="600px" @ok="onSubmit" :destroy-on-close="true">
    <a-form ref="form" :model="data" :label-col="{ span:4 }">
      <a-form-item label="项目全称" name="name"
                   :rules="{required: true, message: '请填写项目名称'}">
        <a-input v-model:value="data.name"/>
      </a-form-item>

      <a-form-item label="所属部门" name="department_id">
        <a-select v-model:value="data.department_id" :options="departmentOptions"/>
      </a-form-item>

      <a-form-item label="项目编号" name="project_code">
        <a-input v-model:value="data.code"/>
      </a-form-item>

      <a-form-item label="项目类型" name="project_type">
        <a-select v-model:value="data.type" :options="projectTypeOptions"/>
      </a-form-item>

      <a-form-item label="所在国家" name="country"
                   :rules="{required: true, message: '请填写所在国家'}">
        <a-select v-model:value="data.country" :options="countryOptions"/>
      </a-form-item>

      <a-form-item label="项目金额">
        <a-input-number id="project_amount" v-model:value="data.amount" :min="0"
                        :controls="false" :precision="2">
          <template #addonAfter>
            <a-select id="project_currency" v-model:value="data.currency"
                      :options="currencyOptions"/>
          </template>
        </a-input-number>
      </a-form-item>

      <a-form-item label="汇率" name="exchange_rate">
        <a-input-number v-model:value="data.exchange_rate" :min="0" :controls="false"
                        :precision="4"/>
      </a-form-item>

      <a-form-item label="项目状态" name="project_status">
        <a-select v-model:value="data.status" :options="statusOptions"/>
      </a-form-item>

      <a-form-item label="对方名称" name="related_party_id">
        <a-select v-model:value="data.related_party_id" :options="relatedPartyOptions"/>
      </a-form-item>

      <a-form-item label="我方主体" name="our_signatory">
        <a-select v-model:value="data.our_signatory" :options="ourSignatoryOptions"/>
      </a-form-item>

      <a-form-item label="约定工期" name="duration">
        <a-input-number v-model:value="data.construction_period" style="width: 120px"
                        :controls="false">
          <template #addonAfter>
            <span>天</span>
          </template>
        </a-input-number>
      </a-form-item>

      <a-form-item label="签约日期">
        <a-date-picker v-model:value="signingDate">
        </a-date-picker>
      </a-form-item>

      <a-form-item label="生效日期">
        <a-date-picker v-model:value="effectiveDate">
        </a-date-picker>
      </a-form-item>

      <a-form-item label="工作内容">
        <a-textarea v-model:value="data.content" placeholder="请输入工作内容"
                    :rows="3">
        </a-textarea>
      </a-form-item>

      <a-form-item label="附件">
        <a-upload
            v-model:file-list="fileList"
            name="file" :multiple="true"
            action="http://localhost:8000/api/file/upload/single"
            :before-upload="beforeUpload"
            @change="handleChange"

            :headers="headers">
          <a-row>
            <a-button>
              <upload-outlined></upload-outlined>
              上传
            </a-button>
            <div style="margin-top:auto;margin-bottom: auto;margin-left: 10px">
              支持后缀：<span style="color: red">.jpg/.png</span>，大小≤<span style="color: red">50MB</span>
            </div>
          </a-row>
        </a-upload>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {FormInstance, message, Upload, UploadChangeParam, UploadProps} from "ant-design-vue";
import {iProjectUpdate, projectApi,} from "@/api/project";
import {dictionaryItemApi} from "@/api/dictionary-item";
import dayjs, {Dayjs} from "dayjs";
import useUserStore from "@/store/user";
import {organizationApi} from "@/api/organization";
import {relatedPartyApi} from "@/api/related-party";
import {UploadOutlined} from "@ant-design/icons-vue";

const userStore = useUserStore()

const token = userStore.accessToken

const headers = {"access_token": token}

const action = ref('http://localhost:8000/api/file/upload/single')

const fileList = ref([{
  name: 'xx发生大幅x.png',
  response: 'Server Error 500', // custom error message to show
  url: 'http://www.baidu.com/xxx.png',
},])

function toBeCompleted() {
}

const countryOptions = ref<{ value: string, label: string }[]>([])
const projectTypeOptions = ref<{ value: string, label: string }[]>([])
const currencyOptions = ref<{ value: string, label: string }[]>()
const departmentOptions = ref<{ value: string, label: string }[]>()
const statusOptions = ref<{ value: string, label: string }[]>()
const relatedPartyOptions = ref<{ value: string, label: string }[]>()
const ourSignatoryOptions = ref<{ value: string, label: string }[]>()

const data = reactive<iProjectUpdate>({id: 0})

// 签约日期
let signingDate = ref<Dayjs>()

// 生效日期
let effectiveDate = ref<Dayjs>()

const visible = ref(false)
const form = ref<FormInstance>()

function resetForm() {
  Object.keys(data).map(key => {
    delete data[key as keyof typeof data]
  })
  //记得还要修改不在reactive里的数据
}

const emit = defineEmits(['loadTableData'])

function showModal(projectID: number) {
  visible.value = true
  projectApi.get({id: projectID}).then(
      res => {
        data.id = res.data?.id || undefined
        data.code = res.data?.code
        data.name = res.data?.name
        data.country = res.data?.country?.id || undefined
        data.type = res.data?.type?.id || undefined
        data.amount = res.data?.amount || undefined
        data.currency = res.data?.currency?.id || undefined
        data.exchange_rate = res.data?.exchange_rate || undefined
        data.status = res.data?.status?.id || undefined
        data.our_signatory = res.data?.our_signatory?.id || undefined
        data.construction_period = res.data?.construction_period || undefined
        data.department_id = res.data?.department?.id || undefined
        data.related_party_id = res.data?.related_party_id || undefined
        signingDate.value = res.data?.signing_date ? dayjs(res.data.signing_date) : undefined
        effectiveDate.value = res.data?.effective_date ? dayjs(res.data.effective_date) : undefined
        data.content = res.data?.content
      }
  )

  dictionaryItemApi.getList({dictionary_type_name: "国家"}).then(
      res => {
        if (res.data) {
          let result: { value: string, label: string }[] = []
          for (let item of res.data) {
            result.push({value: item.id, label: item.name})
          }
          countryOptions.value = result
        }
      }
  )

  dictionaryItemApi.getList({dictionary_type_name: "项目类型"}).then(
      res => {
        if (res.data) {
          let result: { value: string, label: string }[] = []
          for (let item of res.data) {
            result.push({value: item.id, label: item.name})
          }
          projectTypeOptions.value = result
        }
      }
  )

  dictionaryItemApi.getList({dictionary_type_name: "币种"}).then(
      res => {
        if (res.data) {
          let result: { value: string, label: string }[] = []
          for (let item of res.data) {
            result.push({value: item.id, label: item.name})
          }
          currencyOptions.value = result
        }
      }
  )

  dictionaryItemApi.getList({dictionary_type_name: "项目状态"}).then(
      res => {
        if (res.data) {
          let result: { value: string, label: string }[] = []
          for (let item of res.data) {
            result.push({value: item.id, label: item.name})
          }
          statusOptions.value = result
        }
      }
  )

  organizationApi.getList({page_size: 100, level_name: "部门",}).then(
      res => {
        if (res.data) {
          let result: { value: string, label: string }[] = []
          for (let item of res.data) {
            result.push({value: item.id, label: item.name})
          }
          departmentOptions.value = result
        }
      }
  )

  relatedPartyApi.getList({page_size: 100,}).then(
      res => {
        if (res.data) {
          let result: { value: string, label: string }[] = []
          for (let item of res.data) {
            result.push({value: item.id, label: item.chinese_name})
          }
          relatedPartyOptions.value = result
        }
      }
  )

  dictionaryItemApi.getList({dictionary_type_name: "我方签约主体"}).then(
      res => {
        if (res.data) {
          let result: { value: string, label: string }[] = []
          for (let item of res.data) {
            result.push({value: item.id, label: item.name})
          }
          ourSignatoryOptions.value = result
        }
      }
  )
}


function onSubmit() {
  form.value?.validateFields().then(
      () => {
        projectApi.update({
          id: data.id,
          code: data.code,
          name: data.name,
          country: data.country === null ? -1 : data.country,
          type: data.type === null ? -1 : data.type,
          amount: data.amount === null ? -1 : data.amount,
          currency: data.currency === null ? -1 : data.currency,
          exchange_rate: data.exchange_rate === null ? -1 : data.exchange_rate,
          status: data.status === null ? -1 : data.status,
          our_signatory: data.our_signatory === null ? -1 : data.status,
          construction_period: data.construction_period === null ? -1 : data.construction_period,
          department_id: data.department_id === null ? -1 : data.department_id,
          related_party_id: data.related_party_id === null ? -1 : data.related_party_id,
          content: data.content,
          signing_date: signingDate.value?.format("YYYY-MM-DD") || "",
          effective_date: effectiveDate.value?.format("YYYY-MM-DD") || "",
        }).then(res => {
          if (res?.code === 0) {
            message.success('修改成功')
            visible.value = false
            emit('loadTableData')
          } else {
            message.error(res?.message || '修改失败')
          }
        });
      })
}

//上传文件
function beforeUpload(file: any) {
  const isLessThan50MB = file.size / 1024 / 1024 < 50
  if (!isLessThan50MB) {
    message.error('上传的文件必须小于50MB')
    return Upload.LIST_IGNORE
  }

  const suffixIsLegal = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!suffixIsLegal) {
    message.error('只支持后缀为.jpg/.png的文件')
    return Upload.LIST_IGNORE
  }

  return (isLessThan50MB && suffixIsLegal) || Upload.LIST_IGNORE
}

const handleChange = ({file, fileList: innerFileList}: UploadChangeParam) => {
  if (file.status == 'done') {
    if (file.response?.code === 0) {
      file.url = 'http://127.0.0.1:8000/download/' + file.response?.data?.file_name
      console.log(file);
      return file.name
    }
  }
};

defineExpose({showModal,})

</script>

<style lang="scss">
#project_amount {
  //text-align: right;
  width: 120px;
}
</style>
