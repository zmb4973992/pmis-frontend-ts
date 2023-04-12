<template>
  <a-modal v-model:visible="visible" title="删除进度" @ok="onSubmit" style="width: 450px">
    <div>确定要删除“
      <span style="color:red;">
        {{ progress.date }}、{{ progress.type }}、{{ progress.value }}
      </span>
      ”吗？
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {progressApi} from "@/api/progress";

const visible = ref(  false)

interface progressItem {
  ID?: number
  date?: string
  type?: string
  value?: string

}

const emit = defineEmits(['loadData'])

const progress = reactive<progressItem>({})


async function showModal(progressID: number) {
  visible.value = true
  progress.ID = progressID
  let res = await progressApi.get({id: progressID})
  if (res && res?.data) {
    progress.date = res.data.date
    progress.type = res.data.type.name
    progress.value = res.data.value * 100 + "%"
  }
}


async function onSubmit() {
  let res = await progressApi.delete({id: progress.ID as number})
  if (res?.code === 0) {
    message.success('删除成功')
    visible.value = false
    emit('loadData')
  } else {
    message.error(res.message)
  }
}

defineExpose({
  showModal,
})

</script>

<style scoped lang="scss">

</style>
