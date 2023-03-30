<template>
  <a-modal v-model:visible="visible" title="修改进度" @ok="onSubmit" style="width: 450px">

    <a-form ref="form" :model="formData" :label-col="{span:5}" :wrapper-col="{span:19}"
            :rules="rules">

      <a-form-item name="date" label="日期">
        <a-date-picker v-model:value="formData.date"/>
      </a-form-item>

      <a-form-item name="type" label="类型">
        <a-select v-model:value="formData.type" :options="options.type"/>
      </a-form-item>

      <a-form-item name="value" label="进度值">
        <a-input-number v-model:value="formData.value" :controls="false"
                        addon-after="%" :min="0" :max="100" :precision="1"
                        style="width: 120px"/>
      </a-form-item>

      <a-form-item name="remarks" label="备注">
        <a-input v-model:value="formData.remarks">

        </a-input>
      </a-form-item>

      {{ formData }}

    </a-form>

  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, message, SelectProps} from "ant-design-vue";
import {Rule} from "ant-design-vue/es/form";
import dayjs, {Dayjs} from "dayjs";
import {progressApi} from "@/api/progress";
import {dictionaryItemApi} from "@/api/dictionary-item";

interface formDataFormat {
  progressID?: number
  date?: Dayjs
  type?:number
  value?: number
  remarks?: string
}

const formData = reactive<formDataFormat>({})

//进度值的校验规则
let checkValue = async (_rule: Rule, value: number) => {
  if (!value && value !== 0) {
    return Promise.reject('请输入权重的值');
  } else if (value < 0 || value > 100) {
    return Promise.reject('权重的值应该≥0、≤100');
  } else {
    return Promise.resolve();
  }
};

//表单校验规则
const rules: Record<string, Rule[]> = {
  date: [{required: true, trigger: 'change',}],
  type: [{required: true, trigger: 'change',}],
  value: [{required: true, trigger: 'change', validator: checkValue,}],
};

const visible = ref(false)
const form = ref<FormInstance>()

const emits = defineEmits(['loadData'])

async function showModal(progressID: number) {
  form.value?.resetFields()
  formData.progressID = progressID
  let res = await progressApi.get({id: progressID})
  if (res && res.data) {
    console.log(res.data);
    formData.date = dayjs(res.data?.date)
    formData.type = res.data?.type?.id
    formData.value = res.data?.value * 100
    formData.remarks = res.data?.remarks
    visible.value = true
  }
}

const options = reactive<{ type: SelectProps['options'], }>({
  type: [],
})
dictionaryItemApi.getList({dictionary_type_name: "进度类型"}).then(
    res => {
      if (res.data) {
        for (let item of res.data) {
          options.type?.push({value: item.id, label: item.name})
        }
      }
    }
)

function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        let res = await progressApi.update({
          id:formData.progressID as number,
          date: formData.date?.format("YYYY-MM-DD"),
          type: formData.type as number,
          value: formData.value as number / 100,
          remarks: formData.remarks,
        })
        if (res?.code === 0) {
          message.success('修改成功')
          visible.value = false
          emits('loadData')
        } else {
          message.error(res.message)
        }
      },
  )
}

defineExpose({
  showModal,
})
</script>

<style scoped lang="scss">
//调整tree-select子项的缩进距离，默认是2em
.tree3 {
  .ant-select-tree-indent-unit {
    width: 1em;
  }
}
</style>
