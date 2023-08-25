<template>
  <a-modal v-model:visible="visible" title="修改拆解项" @ok="onSubmit"
           style="width: 450px">

    <a-form ref="form" :model="formData"
            :label-col="{span:5}" :wrapper-col="{span:19}"
            :rules="rules">
      <a-form-item name="name" label="名称">
        <a-input v-model:value="formData.name"/>
      </a-form-item>

      <a-form-item name="weight" label="权重">
        <a-input-number v-model:value="formData.weight" :controls="false"
                        addon-after="%" :min="0" :max="100" :precision="1"
                        style="width: 120px"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {disassemblyApi} from "@/api/disassembly";
import {FormInstance, message} from "ant-design-vue";
import {Rule} from "ant-design-vue/es/form";

interface formDataFormat {
  disassemblyID: number
  name?: string
  weight?: number
}

const formData = reactive<formDataFormat>({
  disassemblyID: 0,
})

//权重的校验规则
let checkWeight = async (_rule: Rule, value: number) => {
  if (!value && value !== 0) {
    return Promise.reject('请输入权重的值');
  } else if (value <= 0 || value > 100) {
    return Promise.reject('权重的值应该大于0、小于等于100');
  } else {
    return Promise.resolve();
  }
};

//表单校验规则
const rules: Record<string, Rule[]> = {
  superiorID: [{required: true, trigger: 'change',}],
  name: [{required: true, trigger: 'change'}],
  weight: [{required: true, validator: checkWeight, trigger: 'change'}],
};

const visible = ref(false)
const form = ref<FormInstance>()

const emits = defineEmits(['loadData'])

async function showModal(disassemblyID: number) {
  form.value?.resetFields()
  formData.disassemblyID = disassemblyID
  let res = await disassemblyApi.get({id: disassemblyID})
  if (res?.code === 0) {
    formData.name = res.data.name
    formData.weight = res.data.weight * 100
    visible.value = true
  } else {
    console.log(res.message)
  }
}

function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        let res = await disassemblyApi.update({
          id: formData.disassemblyID,
          name: formData.name,
          weight: formData.weight as number / 100
        })
        if (res?.code === 0) {
          message.success('修改成功')
          visible.value = false
          emits('loadData')
        } else {
          message.error(res.message)
        }
      }
  )
}

defineExpose({showModal,})

</script>

<style scoped lang="scss">
//调整tree-select子项的缩进距离，默认是2em
.tree3 {
  .ant-select-tree-indent-unit {
    width: 1em;
  }
}
</style>
