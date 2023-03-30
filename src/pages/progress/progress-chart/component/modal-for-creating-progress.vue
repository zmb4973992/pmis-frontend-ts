<template>
  <a-modal v-model:visible="visible" title="添加进度" @ok="onSubmit" style="width: 450px;">

    <a-form ref="form" :model="formData" :label-col="{span:5}" :wrapper-col="{span:19}"
            :rules="rules">
      <a-form-item name="disassemblyID" label="名称">
        <a-tree-select v-model:value="formData.disassemblyID"
                       tree-default-expand-all :tree-data="treeData"
                       dropdownClassName="tree2"/>
      </a-form-item>

      <a-form-item name="date" label="日期">
        <a-date-picker v-model:value="formData.date" />
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
import {reactive, ref, watch} from "vue";
import {FormInstance, message, SelectProps} from "ant-design-vue";
import {disassemblyApi} from "@/api/disassembly";
import {Rule} from "ant-design-vue/es/form";
import {Dayjs} from "dayjs";
import {progressApi} from "@/api/progress";
import {dictionaryItemApi} from "@/api/dictionary-item";

//树形图相关的数据
interface treeDataFormat {
  title: string
  value: number
  children: treeDataFormat[] | null
}

let treeData = ref<treeDataFormat[]>([])

async function loadTreeData() {
  //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
  treeData.value = []
  const res = await disassemblyApi.getTree({project_id: props.projectID as number})
  if (res.data) {
    for (let index in res.data) {
      treeData.value.push(switchToTreeData(res.data[index]))
    }
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

const props = defineProps<{
  projectID?: number
}>()

interface formDataFormat {
  disassemblyID?: number
  date?: Dayjs
  type?: number
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

//表单校验规则
const rules: Record<string, Rule[]> = {
  disassemblyID: [{required: true, trigger: 'change',}],
  date: [{required: true, trigger: 'change',}],
  type: [{required: true, trigger: 'change',}],
  value: [{required: true, trigger: 'change', validator: checkValue,}],
};

const visible = ref(false)

const emit = defineEmits(['loadData'])

async function showModal(disassemblyID?: number) {
  form.value?.resetFields()
  if (disassemblyID) {
    formData.disassemblyID = disassemblyID
    let res = await disassemblyApi.get({id: disassemblyID})
    if (res && res?.data) {
      visible.value = true
    }
  } else {
    formData.disassemblyID = undefined
    visible.value = true
  }
  await loadTreeData()
}


function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        let res = await progressApi.create({
          disassembly_id: formData.disassemblyID as number,
          date: formData.date?.format("YYYY-MM-DD") as string,
          type: formData.type as number,
          value: formData.value as number / 100,
          remarks: formData.remarks,
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

<style lang="scss">
//调整tree-select子项的缩进距离，默认是2em
.tree2 {
  .ant-select-tree-indent-unit {
    width: 1em;
  }
}


</style>
