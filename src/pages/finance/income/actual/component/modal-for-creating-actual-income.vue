<template>
  <a-modal v-model:visible="visible" title="添加实际收款" @ok="onSubmit" style="width: 450px;">

    <a-form ref="form" :model="formData" :label-col="{span:5}" :wrapper-col="{span:19}"
            :rules="rules">
      <a-form-item label="项目名称" name="projectID">
        <a-select placeholder="项目名称" show-search allow-clear
                  :filter-option="projectFilterOption"
                  v-model:value="formData.projectID"
                  :options="projectOptions"/>
      </a-form-item>

      <a-form-item label="合同名称" name="contractID">
        <a-select placeholder="合同名称" show-search allow-clear
                  :filter-option="contractFilterOption"
                  v-model:value="formData.contractID"
                  :options="contractOptions"/>
      </a-form-item>

      <a-form-item name="date" label="日期">
        <a-date-picker v-model:value="formData.date"/>
      </a-form-item>

      <a-form-item name="type" label="类型">
        <a-select placeholder="类型" allow-clear
                  v-model:value="formData.type"
                  :options="typeOptions"/>
      </a-form-item>

      <a-form-item name="term" label="方式">
        <a-select placeholder="方式" allow-clear
                  v-model:value="formData.term"
                  :options="termOptions"/>
      </a-form-item>

      <a-form-item name="amount" label="金额">
        <a-input-number v-model:value="formData.amount" :controls="false"
                        :min="0" :precision="2"
                        style="width: 250px">
          <template #addonAfter>
            <a-form-item name="currency"
                         style="margin-bottom: -2px;margin-top: -2px;width: 80px">
              <a-select placeholder="币种" v-model:value="formData.currency"
                        :options="currencyOptions" style="width: 103px"/>
            </a-form-item>
          </template>
        </a-input-number>
      </a-form-item>

      <a-form-item v-if="exchange_rate_visible" name="exchangeRate" label="汇率">
        <a-input-number v-model:value="formData.exchangeRate" :controls="false"
                        :min="0" :precision="4" style="width: 120px">
        </a-input-number>
      </a-form-item>

      <a-form-item name="remarks" label="备注">
        <a-textarea v-model:value="formData.remarks" placeholder="备注" :rows="2"/>
      </a-form-item>

      <!--      <a-form-item name="type" label="类型">-->
      <!--        <a-select v-model:value="formData.type" :options="options.type"/>-->
      <!--      </a-form-item>-->

      <!--      <a-form-item name="value" label="进度值">-->
      <!--        <a-input-number v-model:value="formData.value" :controls="false"-->
      <!--                        addon-after="%" :min="0" :max="100" :precision="1"-->
      <!--                        style="width: 120px"/>-->
      <!--      </a-form-item>-->

    </a-form>

  </a-modal>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {FormInstance, message, SelectProps} from "ant-design-vue";
import {disassemblyApi} from "@/api/disassembly";
import {Rule} from "ant-design-vue/es/form";
import {Dayjs} from "dayjs";
import {progressApi} from "@/api/progress";
import {dictionaryDetailApi} from "@/api/dictionary-item";
import {projectApi} from "@/api/project";
import {contractApi} from "@/api/contract";
import {incomeAndExpenditureApi} from "@/api/income-and-expenditure";

//项目下拉框
const projectOptions = ref<SelectProps['options']>([])

//项目下拉框搜索过滤
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

//获取项目下拉框的选项
async function loadProjectOptions() {
  try {
    let res = await projectApi.getList({page_size: 0})
    for (let item of res.data) {
      projectOptions.value?.push({label: item.name, value: item.id})
    }
  } catch (err) {
    console.log(err)
  }
}

//合同下拉框
const contractOptions = ref<SelectProps['options']>([])

//加载项目下拉框选项
loadProjectOptions()

//合同下拉框搜索过滤
const contractFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

//获取合同下拉框的选项
async function loadContractOptions() {
  try {
    let res = await contractApi.getList({page_size: 0})
    for (let item of res.data) {
      contractOptions.value?.push({label: item.name, value: item.id})
    }
  } catch (err) {
    console.log(err)
  }
}

async function updateContractOptions() {
  try {
    if (formData.projectID) {
      contractOptions.value = []
      let res = await contractApi.getList({page_size: 0, project_id: formData.projectID})
      for (let item of res.data) {
        contractOptions.value?.push({label: item.name, value: item.id})
      }
    }
  } catch (e) {
    console.log(e);
  }
}

//加载合同下拉框选项
//这里不要立刻加载，应该等选完了项目后再根据项目号加载
// loadContractOptions()

//类型下拉框
const typeOptions = ref<SelectProps['options']>([])

//获取类型下拉框的选项
async function loadTypeOptions() {
  try {
    let res = await dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: "款项类型"})
    for (let item of res.data) {
      typeOptions.value?.push({label: item.name, value: item.id})
    }
  } catch (err) {
    console.log(err)
  }
}

//加载类型下拉框的选项
loadTypeOptions()

//方式下拉框
const termOptions = ref<SelectProps['options']>([])

//获取方式下拉框的选项
async function loadTermOptions() {
  try {
    let res = await dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: "收付款方式"})
    for (let item of res.data) {
      termOptions.value?.push({label: item.name, value: item.id})
    }
  } catch (err) {
    console.log(err)
  }
}

//加载类型下拉框的选项
loadTermOptions()

//币种下拉框
const currencyOptions = ref<SelectProps['options']>([])

//获取币种下拉框的选项
async function loadCurrencyOptions() {
  try {
    let res = await dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: "币种"})
    for (let item of res.data) {
      currencyOptions.value?.push({label: item.name, value: item.id})
      if (item.name === '人民币') {
        id_of_CNY.value = item.id
      }
    }


  } catch (err) {
    console.log(err)
  }
}

//加载币种下拉框的选项
loadCurrencyOptions()

//人民币的id
const id_of_CNY = ref<number>()

//汇率下拉框是否显示
const exchange_rate_visible = ref(false)


onMounted(() => {
  watch(() => formData.projectID, (newValue) => {
    updateContractOptions()
  })
  watch(() => formData.currency, (newValue) => {
    if (newValue === id_of_CNY.value) {
      exchange_rate_visible.value = false
      formData.exchangeRate = 1
    } else {
      exchange_rate_visible.value = true
      formData.exchangeRate = undefined
    }
  })

})

const form = ref<FormInstance>()

const props = defineProps<{
  projectID?: number
}>()

interface formDataFormat {
  projectID?: number
  contractID?: number
  fundDirection?: number
  currency?: number

  kind?: number
  date?: Dayjs
  amount?: number
  exchangeRate?: number
  type?: string
  condition?: string
  term?: string
  remarks?: string
}

const formData = reactive<formDataFormat>({})

//进度值的校验规则
// let checkValue = async (_rule: Rule, value: number) => {
//   if (!value && value !== 0) {
//     return Promise.reject('请输入权重的值');
//   } else if (value < 0 || value > 100) {
//     return Promise.reject('权重的值应该≥0、≤100');
//   } else {
//     return Promise.resolve();
//   }
// };

//表单校验规则
const rules: Record<string, Rule[]> = {
  projectID: [{required: true, trigger: 'change',}],
  date: [{required: true, trigger: 'change',}],
  type: [{required: true, trigger: 'change',}],
  term: [{required: true, trigger: 'change',}],
  amount: [{required: true, trigger: 'change',}],
  currency: [{required: true, trigger: 'change',}],
  exchangeRate: [{required: true, trigger: 'change',}],
};

const visible = ref(false)

const emits = defineEmits(['loadData'])

async function showModal() {
  form.value?.resetFields()
  visible.value = true
}


function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        try {
          let res = await incomeAndExpenditureApi.create({
            kind: "实际",
            fund_direction: "收款",
            project_id: formData.projectID,
            contract_id: formData.contractID,
            date: formData.date?.format("YYYY-MM-DD"),
            type: formData.type,
            term: formData.term,
            amount: formData.amount,
            currency: formData.currency,
            exchange_rate: formData.exchangeRate,
            remarks: formData.remarks,
          })
          console.log(res)
          if (res.code === 0) {
            message.success("添加成功")
            emits("loadData")
            visible.value = false
          }
        } catch (e: any) {
          console.log(e);
          message.warn(e)
        }
      }
  )
}

defineExpose({
  showModal,
})

</script>

<style lang="scss">

</style>
