<template>
  <a-modal v-model:visible="visible" title="添加子项"
           @ok="onSubmit" style="width: 400px;">

    <a-form ref="form" :model="disassemblyData">
      <div style="margin-bottom: 5px">
        <span style="margin-right: 127px">名称：</span>
        <span>权重：</span>
      </div>
      <a-space v-for="(disassemblyItem, index) in disassemblyData.disassemblySubitems"
               style="display: flex; margin-bottom: 0;" align="baseline">
        <a-form-item :name="['disassemblySubitems', index, 'name']" style="width: 160px"
                     :rules="{required: true, message: '请填写名称'}">
          <a-input v-model:value="disassemblyItem.name"/>
        </a-form-item>
        <a-form-item :name="['disassemblySubitems', index, 'weight']"
                     :rules="{required: true, message: '请填写权重'}">
          <a-input-number v-model:value="disassemblyItem.weight" :controls="false"
                          id="a1" addon-after="%" :min="0" :max="100" :precision="1"/>
        </a-form-item>

        <MinusCircleOutlined v-if="disassemblyData.disassemblySubitems.length > 1"
                             @click="removeItem(disassemblyItem)"/>
      </a-space>
      <a-form-item>
        <a-button @click="addItem">
          <PlusOutlined/>
          添加一行
        </a-button>
      </a-form-item>

      {{ disassemblyData.disassemblySubitems }}
    </a-form>

  </a-modal>

</template>

<script setup lang="ts">
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";

import {nextTick, reactive, ref} from "vue";
import {FormInstance, message} from "ant-design-vue";
import {disassemblyApi, iDisassemblyCreate} from "@/api/disassembly";

const form = ref<FormInstance>()

const visible = ref(false)

function resetForm() {
  form.value!.clearValidate();
}

interface disassemblyItem {
  disassembly_id: number
  name: string
  weight?: number
  project_id: number
  level: number
  superior_id: number
}

//disassemblyItem为当前选中项，用来删改查；disassemblySubitems为当前选中项的子项，用来批量新增
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

const emits = defineEmits(['loadDisassemblyTree'])

function onSubmit() {
  form.value!.validateFields().then(() => {
        let params: iDisassemblyCreate[] = []
        for (let item of disassemblyData.disassemblySubitems) {
          params.push({
            name: item.name,
            project_id: disassemblyData.disassemblyItem.project_id,
            weight: item.weight! / 100,
            level: disassemblyData.disassemblyItem.level + 1,
            superior_id: disassemblyData.disassemblyItem.disassembly_id,
          })
        }
        return disassemblyApi.createInBatches({param:params})
      },
  ).then(() => {
    message.success('添加成功')
    visible.value = false
    emits('loadDisassemblyTree')
  })
}

async function showModal(disassemblyID: number) {
  disassemblyApi.get({id:disassemblyID}).then(res => {
    disassemblyData.disassemblyItem.disassembly_id = res.data.id
    disassemblyData.disassemblyItem.level = res.data.level
    disassemblyData.disassemblyItem.name = res.data.name
    disassemblyData.disassemblyItem.project_id = res.data.project_id
    disassemblyData.disassemblyItem.superior_id = res.data.superior_id
    disassemblyData.disassemblyItem.weight = res.data.weight
     if (disassemblyData.disassemblyItem.level > 0 && disassemblyData.disassemblyItem.level < 5) {
      visible.value = true
      disassemblyData.disassemblySubitems = [{
        name: '',
        project_id: 0,
        superior_id: 0,
        level: 0,
        disassembly_id: 0,
      }]
      //dom更新完毕后，清除掉上一次form的验证结果
      nextTick(()=> form.value!.clearValidate())
    } else {
      message.error('系统最高支持拆分到5层，当前已经是第5层，无法继续拆分了', 5)
    }
  })
}

const addItem = () => {
  disassemblyData.disassemblySubitems.push({
    name: '',
    project_id: 0,
    level: 0,
    superior_id: 0,
    disassembly_id: 0,
  });
};

const removeItem = (item: disassemblyItem) => {
  let index = disassemblyData.disassemblySubitems.indexOf(item);
  if (index !== -1) {
    disassemblyData.disassemblySubitems.splice(index, 1);
  }
};

defineExpose({
  showModal,
})

</script>

<style scoped lang="scss">
//input组件添加addon-before/addon-after属性后会发生错位，这里进行调整
:deep(.ant-input-number-group-wrapper) {
  margin-top: -5px;
  margin-bottom: -5px;
}

//调整数字输入框的对齐方式
:deep(#a1.ant-input-number-input) {
  text-align: right;
  width: 55px;
}

//调整数字输入框的对齐方式
:deep(#a2.ant-input-number-input) {
  text-align: right;
  width: 55px;
}
</style>
