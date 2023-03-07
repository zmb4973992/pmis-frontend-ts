<template>
  <a-modal v-model:visible="visible" title="添加子项"
           @ok="onSubmit" style="width: 450px;">

    <a-form ref="form" :model="formData" :label-col="{span:6}" :wrapper-col="{span:18}"
            :rules="rules">
      <a-form-item name="superiorID" label="上级名称">
        <a-tree-select v-model:value="formData.superiorID" show-search disabled
                       allow-clear tree-default-expand-all :tree-data="treeData">
        </a-tree-select>
      </a-form-item>

      <a-form-item name="name" label="名称">
        <a-input v-model:value="formData.name"/>
      </a-form-item>

      <a-form-item name="weight" label="权重">
        <a-input-number v-model:value="formData.weight" :controls="false"
                        id="a1" addon-after="%" :min="0" :max="100" :precision="1"
                        style="width: 120px"/>
      </a-form-item>

      {{ formData }}
    </a-form>

  </a-modal>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, message} from "ant-design-vue";
import {disassemblyApi, iDisassemblyCreate} from "@/api/disassembly";
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
  superiorID: number
  name: string
  weight?: number
  level: number
}

const formData = reactive<formDataFormat>({
  superiorID: 0,
  name: '',
  projectID: 0,
  level: 0
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

const emits = defineEmits(['loadData'])

async function showModal(disassemblyID: number) {
  form.value?.resetFields()
  formData.superiorID = disassemblyID
  let res = await disassemblyApi.get({id: disassemblyID})
  if (res && res?.data) {
    if (res.data?.level > 0 && res.data?.level < 5) {
      visible.value = true
      formData.projectID = res.data.project_id
      formData.level = res.data.level + 1
      await loadTreeData()
    } else {
      message.error('系统最高支持拆分到5层，当前已经是第5层，无法继续拆分了', 5)
    }
  }
}

function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        let res = await disassemblyApi.create({
          name: formData.name,
          project_id: formData.projectID,
          superior_id: formData.superiorID,
          level: formData.level,
          weight: formData.weight as number / 100
        })
        console.log(res)
        if (res?.code === 0) {
          message.success('添加成功')
          visible.value = false
          emits('loadData')
        }
      },
  )
}

defineExpose({
  showModal,
})

</script>

<style lang="scss">
//input组件添加addon-before/addon-after属性后会发生错位，这里进行调整
.ant-input-number-group-wrapper {
  margin-top: -5px;
  margin-bottom: -5px;
}

//调整数字输入框的对齐方式
#a2.ant-input-number-input {
  text-align: right;
  width: 55px;
}

//调整tree-select子项的缩进距离，默认是2em，太宽
.ant-select-tree-indent-unit {
  width: 1em;
}

</style>
