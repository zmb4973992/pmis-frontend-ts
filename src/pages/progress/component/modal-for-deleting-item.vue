<template>
  <a-modal v-model:visible="visible"
           title="删除" @ok="submitForm" style="width: 300px">
    <div>确定要删除“{{ disassemblyData.disassemblyItem.name }}”吗？</div>
    <div>该分类和它的子分类都会被删除！</div>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {disassemblyApi} from "@/api/disassembly";
import {message} from "ant-design-vue";

const visible = ref(false)

interface disassemblyItem {
  disassembly_id: number
  name: string
  weight?: number
  project_id: number
  level: number
  superior_id: number
}

const emit = defineEmits(['reloadDisassemblyTree'])

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


function showModal(disassemblyID: number) {
  visible.value = true
  disassemblyData.disassemblyItem.disassembly_id = disassemblyID
  disassemblyApi.getDisassembly(disassemblyID).then(
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
  disassemblyApi.deleteDisassemblyWithSubitems(disassemblyData.disassemblyItem.disassembly_id).then(
      () => {
        message.success('删除成功', 2)
        visible.value = false
        disassemblyApi.getDisassemblyTree(52).then(res => {
          emit('updateDisassemblyTree')
        })
      }
  )
}

defineExpose({
  showModal,
})

</script>

<style scoped lang="scss">

</style>
