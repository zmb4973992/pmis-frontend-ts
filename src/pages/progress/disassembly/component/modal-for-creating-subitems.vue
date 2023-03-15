<template>
    <a-modal v-model:visible="visible" title="添加子项" @ok="onSubmit" style="width: 450px;">

      <a-form ref="form" :model="formData" :label-col="{span:5}" :wrapper-col="{span:19}"
              :rules="rules">
        <a-form-item name="superiorID" label="上级名称">
          <a-tree-select v-model:value="formData.superiorID" show-search
                         tree-default-expand-all :tree-data="treeData"
                         @change="treeSelectChange" dropdownClassName="tree2">
          </a-tree-select>
        </a-form-item>

        <a-form-item name="name" label="名称">
          <a-input v-model:value="formData.name"/>
        </a-form-item>

        <a-form-item name="weight" label="权重">
          <a-input-number v-model:value="formData.weight" :controls="false"
                          addon-after="%" :min="0" :max="100" :precision="1"
                          style="width: 120px"/>
        </a-form-item>

        {{ formData }}

      </a-form>

    </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, message} from "ant-design-vue";
import {disassemblyApi} from "@/api/disassembly";
import {Rule} from "ant-design-vue/es/form";

//树形图相关的数据
interface treeDataFormat {
  title: string
  value: number
  children: treeDataFormat[] | null
}

let treeData = ref<treeDataFormat[]>([])

async function loadTreeData() {
  if (props.projectID) {
    //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
    treeData.value = []
    const res = await disassemblyApi.getTree({project_id: props.projectID})
    if (res.data) {
      for (let index in res.data) {
        treeData.value.push(switchToTreeData(res.data[index]))
      }
    }
  } else {
    treeData.value = []
  }
}

interface rawTreeDataFormat {
  name: string
  id: number
  children?: rawTreeDataFormat[] | null
}

//后端返回的结果为：[{name:xxx,id:xxx,children:xxx}]，需要修改字段名称
function switchToTreeData(obj: rawTreeDataFormat): treeDataFormat {
  return {
    title: obj.name,
    value: obj.id,
    children: obj.children?.map(child => switchToTreeData(child)) || null
  }
}

const form = ref<FormInstance>()

const props = defineProps({
  projectID: Number,
  disassemblyID: Number,
})

interface formDataFormat {
  projectID: number
  superiorID?: number
  name?: string
  weight?: number
  level?: number
}

const formData = reactive<formDataFormat>({
  projectID: 0,
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

const emit = defineEmits(['loadData'])

async function showModal() {
  form.value?.resetFields()
  if (props.projectID) {
    formData.projectID = props.projectID
    if (props.disassemblyID) {
      formData.superiorID = props.disassemblyID
      let res = await disassemblyApi.get({id: props.disassemblyID})
      if (res && res?.data) {
        formData.level = res.data.level + 1
        visible.value = true
      }
    } else {
      formData.superiorID = undefined
      visible.value = true
    }
    await loadTreeData()
  } else {
    message.warn("请先在左侧选择项目")
  }
}

function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        let res = await disassemblyApi.create({
          name: formData.name as string,
          superior_id: formData.superiorID as number,
          weight: formData.weight as number / 100
        })
        if (res?.code === 0) {
          message.success('添加成功')
          visible.value = false
          emit('loadData')
        } else {
          message.error(res.message)
        }
      },
  )
}

defineExpose({
  showModal,
})

//当树形图变化时
async function treeSelectChange(disassemblyID: number) {
  let res = await disassemblyApi.get({id: disassemblyID})
  if (res && res?.data) {
    formData.level = res.data.level + 1
  }
}
</script>

<style lang="scss">
//调整tree-select子项的缩进距离，默认是2em
.tree2 {
  .ant-select-tree-indent-unit {
    width: 1em;
  }
}


</style>
