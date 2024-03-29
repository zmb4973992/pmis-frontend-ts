<template>
  <a-modal v-model:visible="visible" title="添加下级" @ok="onSubmit" style="width: 500px;">

    <a-form ref="formRef" :model="formData" :label-col="{span:5}" :wrapper-col="{span:19}"
            :rules="rules">
      <a-form-item name="superiorID" label="上级名称">
        <a-tree-select v-model:value="formData.superiorID"
                       tree-default-expand-all :tree-data="treeData"/>
      </a-form-item>

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
import {FormInstance, message} from "ant-design-vue";
import {disassemblyApi} from "@/api/disassembly";
import {Rule} from "ant-design-vue/es/form";

//树形图相关的数据
interface treeDataFormat {
  title: string
  value: number
  children?: treeDataFormat[]
}

let treeData = ref<treeDataFormat[]>([])

async function loadTreeData() {
  try {
    //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
    treeData.value = []
    const res = await disassemblyApi.getTree({project_id: props.projectID})
    for (let index in res.data) {
      treeData.value.push(switchToTreeData(res.data[index]))
    }
  } catch (err) {
    console.log(err);
  }
}

interface rawTreeDataFormat {
  name: string
  id: number
  children?: rawTreeDataFormat[]
}

//后端返回的结果为：[{name:xxx,id:xxx,children:xxx}]，需要修改字段名称
function switchToTreeData(obj: rawTreeDataFormat): treeDataFormat {
  return {
    title: obj.name,
    value: obj.id,
    children: obj.children?.map(child => switchToTreeData(child)) || undefined
  }
}

const formRef = ref<FormInstance>()

const props = defineProps<{ projectID: number }>()

interface formDataFormat {
  name?: string
  weight?: number
  superiorID?: number
}

const formData = reactive<formDataFormat>({})

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

async function showModal(superiorID?: number) {
  formRef.value?.resetFields()
  if (superiorID) {
    formData.superiorID = superiorID
    let res = await disassemblyApi.get({id: superiorID})
    if (res?.code === 0) {
      visible.value = true
    }
  } else {
    formData.superiorID = undefined
    visible.value = true
  }
  await loadTreeData()
}

function onSubmit() {
  formRef.value?.validateFields().then(
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

</script>

<style scoped lang="scss">

</style>
