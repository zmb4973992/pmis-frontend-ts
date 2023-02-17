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
        <a-input-number v-model:value="data.duration" style="width: 120px"
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


      <!--      <a-form-item label="上传文件">-->
      <!--        <a-upload v-model:file-list="fileList" name="file"-->
      <!--                  action="http://127.0.0.1:8000/api/file/upload/single" :headers="headers"-->
      <!--                  :before-upload="beforeUpload" accept="image/jpeg"-->
      <!--                  @change="handleChange">-->
      <!--          <a-button>-->
      <!--            <upload-outlined></upload-outlined>-->
      <!--            上传文件-->
      <!--          </a-button>-->
      <!--        </a-upload>-->
      <!--      </a-form-item>-->
      {{ data }}
      {{effectiveDate}}

    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, message, UploadChangeParam} from "ant-design-vue";
import {iProjectUpdate, projectApi,} from "@/api/project";
import {dictionaryItemApi} from "@/api/dictionary-item";
import dayjs, {Dayjs} from "dayjs";
import useUserStore from "@/store/user";
import {departmentApi} from "@/api/department";
import {relatedPartyApi} from "@/api/related-party";

const userStore = useUserStore()

const token = userStore.access_token

const headers = {
  'access_token': token,
}

const fileList = ref([])

function handleChange(info: UploadChangeParam) {
}

function a() {
}

function toBeCompleted() {
}

const countryOptions = ref<{ value: string, label: string }[]>([])
const projectTypeOptions = ref<{ value: string, label: string }[]>([])
const currencyOptions = ref<{ value: string, label: string }[]>()
const departmentOptions = ref<{ value: string, label: string }[]>()
const statusOptions = ref<{ value: string, label: string }[]>()
const relatedPartyOptions = ref<{ value: string, label: string }[]>()
const ourSignatoryOptions = ref<{ value: string, label: string }[]>()

const data = reactive<iProjectUpdate>({
  id: 0,
  code: '',
  name: '',
  country: undefined,
  province: undefined,
  type: undefined,
  amount: undefined,
  currency: undefined,
  exchange_rate: undefined,
  signing_date: undefined,
  effective_date:undefined,
  related_party_id: undefined,
  department_id: undefined,
  our_signatory: undefined,
  construction_period: undefined,
  content: undefined,
})

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

const emit = defineEmits(['reloadDisassemblyTree'])

function showModal(projectID: number) {
  visible.value = true
  projectApi.get({id: projectID}).then(
      res => {
        data.id = res.data?.id
        data.code = res.data?.code
        data.name = res.data?.name
        data.country = res.data?.country?.id
        data.type = res.data?.type?.id
        data.amount = res.data?.amount
        data.currency = res.data?.currency?.id
        data.exchange_rate = res.data?.exchange_rate
        data.status = res.data?.status?.id
        data.our_signatory = res.data?.our_signatory?.id
        data.construction_period = res.data?.construction_period
        data.department_id = res.data?.department?.id
        data.related_party_id = res.data?.related_party_id
        signingDate.value = res.data.signing_date ? dayjs(res.data.signing_date) : undefined
        effectiveDate.value = res.data.effective_date ? dayjs(res.data.effective_date) :undefined
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

  departmentApi.getList({page_size: 100, level_name: "部门",}).then(
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
          country: data.country,
          type: data.type,
          amount: data.amount,
          currency: data.currency,
          exchange_rate: data.exchange_rate,
          status:data.status,
          our_signatory:data.our_signatory,
          construction_period:data.construction_period,
          department_id:data.department_id,
          related_party_id:data.related_party_id,
          content:data.content,
          signing_date: signingDate.value?.format("YYYY-MM-DD"),
          effective_date :effectiveDate.value?.format("YYYY-MM-DD")
        }).then((res) => {
          message.success('修改成功')
          visible.value = false
          emit('reloadDisassemblyTree')
        });
      }
  )
}

//上传文件
function beforeUpload(file: any, fileList: any) {
  // if (file.size / 1024 / 1024 > 50) {
  //   message.error('前端校验失败，上传的文件必须小于50MB')
  //   return Upload.LIST_IGNORE
  // }
  //
  //   if (file.type !== 'image/jpg') {
  //     message.error(`只能上传jpg文件`)
  //     return Upload.LIST_IGNORE
  //   }
}


defineExpose({showModal,})

</script>

<style lang="scss">
//调整数字输入框的对齐方式
#project_amount {
  //text-align: right;
  width: 120px;
}


</style>
