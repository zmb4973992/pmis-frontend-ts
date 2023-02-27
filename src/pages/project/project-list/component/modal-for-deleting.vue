<template>
  <a-modal v-model:visible="visible"
           title="删除" @ok="onSubmit" style="width: 300px">
    <div>确定要删除项目“<span style="color: red">{{ data.name }}</span>”吗？</div>
  </a-modal>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {projectApi} from "@/api/project";
import {message} from "ant-design-vue";

const visible = ref()

const emit = defineEmits(['loadList'])

const data = reactive({id: 0, name: ''})

async function showModal(projectID: number) {
  visible.value = true
  let res = await projectApi.get({id: projectID})
  data.name = res.data.name
  data.id = res.data.id
}


async function onSubmit() {
  let res = await projectApi.delete({id: data.id})
  message.success("删除成功")
  visible.value = false
  emit("loadList")
}

defineExpose({showModal,})

</script>

<style scoped lang="scss">

</style>
