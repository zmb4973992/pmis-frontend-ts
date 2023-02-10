<template>
  <a-modal v-model:visible="visible" :after-close="resetForm" title="修改拆解项"
           @ok="submitForm" style="width: 400px">
    <a-form ref="form" :model="disassemblyData.disassemblyItem">
      <a-form-item label="名称：" name="name"
                   :rules="{required: true, message: '请填写名称'}">
        <a-input v-model:value="disassemblyData.disassemblyItem.name"></a-input>
      </a-form-item>
      <a-form-item label="权重：" name="weight"
                   :rules="{required: true, message: '请填写权重'}">
        <a-input-number id="a2" v-model:value="disassemblyData.disassemblyItem.weight"
                        :controls="false" addon-after="%" :min="0" :max="100"
                        :precision="1">
        </a-input-number>
      </a-form-item>
      {{ disassemblyData.disassemblyItem }}
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {disassemblyApi} from "@/api/disassembly";
import {FormInstance, message} from "ant-design-vue";

interface disassemblyItem {
  disassembly_id: number
  name: string
  weight?: number
  project_id: number
  level: number
  superior_id: number
}

const disassemblyData = reactive<{
  disassemblyItem: disassemblyItem,
  disassemblySubitems: disassemblyItem[],
}>({
  disassemblyItem: {
    disassembly_id: 0,
    name: '',
    project_id: 0,
    level: 0,
    superior_id: 0,
  },
  disassemblySubitems: [],
})

const visible = ref(false)
const form = ref<FormInstance>()

function resetForm() {
  form.value!.clearValidate();
}
const emit = defineEmits(['reloadDisassemblyTree'])

function showModal(disassemblyID: number) {
  visible.value = true
  disassemblyData.disassemblyItem.disassembly_id = disassemblyID
  disassemblyApi.get(disassemblyID).then(
      res => {
        if (res.data) {
          disassemblyData.disassemblyItem.name = res.data.name
          disassemblyData.disassemblyItem.weight = res.data.weight * 100
          disassemblyData.disassemblyItem.project_id = res.data.project_id
          disassemblyData.disassemblyItem.level = res.data.level
          disassemblyData.disassemblyItem.superior_id = res.data.superior_id
        }
      }
  )
}

function submitForm() {
  form.value!.validateFields().then(
      () => {
        disassemblyApi.update(disassemblyData.disassemblyItem.disassembly_id, {
          level: disassemblyData.disassemblyItem.level,
          name: disassemblyData.disassemblyItem.name,
          project_id: disassemblyData.disassemblyItem.project_id,
          superior_id: disassemblyData.disassemblyItem.superior_id,
          weight: disassemblyData.disassemblyItem.weight as number / 100
        }).then(() => {
          message.success('修改成功')
          visible.value = false
          emit('updateDisassemblyTree')
        });
      }
  )
}

defineExpose({
  showModal,
})

</script>

<style scoped lang="scss">
//调整数字输入框的对齐方式
:deep(.ant-input-number-input) {
  text-align: right;
  width: 55px;
}
</style>
