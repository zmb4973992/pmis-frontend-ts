<template>
  <a-modal v-model:visible="visible" :after-close="resetForm" title="修改"
           width="600px" @ok="onSubmit">
    <a-form ref="form" :model="data" :label-col="{ span:4 }">
      <a-form-item label="项目全称" name="project_full_name"
                   :rules="{required: true, message: '请填写项目名称'}">
        <a-input v-model:value="data.project_full_name"></a-input>
      </a-form-item>
      <a-form-item label="国家" name="country"
                   :rules="{required: true, message: '请填写所在国家'}">
        <a-select v-model:value="data.country" :options="countryOptions"
                  @change="toBeCompleted">
        </a-select>
      </a-form-item>
      <a-form-item label="项目类型" name="project_type">
        <a-select v-model:value="data.project_type" :options="projectTypeOptions"
                  @change="toBeCompleted">
        </a-select>
      </a-form-item>
      <a-form-item label="项目金额">
        <a-input-number id="aaa" v-model:value="data.amount" :min="0" :controls="false">
          <template #addonAfter>
            <a-select v-model:value="data.currency" :options="currencyOptions">
            </a-select>
          </template>
        </a-input-number>
      </a-form-item>

      <a-form-item label="汇率">
        <a-input-number v-model:value="data.exchange_rate" :min="0" :controls="false">

        </a-input-number>
      </a-form-item>

      <a-form-item label="签约日期">
        <a-date-picker v-model:value="signingDate">
        </a-date-picker>
      </a-form-item>

      <a-form-item label="上传文件">
        <a-upload v-model:file-list="fileList" name="file" :max-count="1"
        action="http://127.0.0.1:8000/api/file/upload/single"
                  :headers="headers"

        @change="handleChange">
          <a-button>
            <upload-outlined></upload-outlined>
            上传文件
          </a-button>
        </a-upload>
      </a-form-item>


    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, message, UploadChangeParam} from "ant-design-vue";
import {projectApi,} from "@/api/project";
import {dictionaryItemApi} from "@/api/dictionary-item";
import dayjs, {Dayjs} from "dayjs";
import {UploadOutlined} from "@ant-design/icons-vue";
import useUserStore from "@/store/user";

const userStore = useUserStore()

const token = userStore.token

const headers = {
  'access_token':token,
}

const fileList = ref([])
function handleChange(info: UploadChangeParam) {
  console.log(info)
}

function a() {
}

function toBeCompleted() {
}

const countryOptions = ref<{ value: string, label: string }[]>([])
const projectTypeOptions = ref<{ value: string, label: string }[]>([])
const currencyOptions = ref<{ value: string, label: string }[]>()

const data = reactive({
  id: 0,
  project_code: '',
  project_full_name: '',
  country: '',
  province: '',
  project_type: '',
  amount: null,
  currency: '',
  exchange_rate: null,
  related_party_id: null,
  department_id: null,
})

const visible = ref(false)
const form = ref<FormInstance>()

function resetForm() {
  form.value!.clearValidate();
}

const emit = defineEmits(['reloadDisassemblyTree'])


// 签约日期
let signingDate = ref<Dayjs>()

function showModal(projectID: number) {
  visible.value = true
  projectApi.get({id: projectID}).then(
      res => {
        if (res.data) {
          data.id = res.data.id
          data.project_code = res.data.project_code
          data.project_full_name = res.data.project_full_name
          data.country = res.data.country
          data.project_type = res.data.project_type
          data.amount = res.data.amount
          data.currency = res.data.currency
          signingDate.value = dayjs(res.data.signing_date)
        }
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
}

function onSubmit() {
  form.value!.validateFields().then(
      () => {
        projectApi.update({
          id: data.id,
          project_code: data.project_code,
          project_full_name: data.project_full_name,
          country: data.country,
          project_type: data.project_type,
          amount: data.amount,
          currency: data.currency,
          exchange_rate: data.exchange_rate,
          signing_date: signingDate.value?.format("YYYY-MM-DD"),
        }).then(() => {
          message.success('修改成功')
          visible.value = false
          emit('reloadDisassemblyTree')
        });
      }
  )
}

defineExpose({showModal,})

</script>

<style lang="scss">
//调整数字输入框的对齐方式
#aaa {
  text-align: right;
  width: 120px;
}
</style>
