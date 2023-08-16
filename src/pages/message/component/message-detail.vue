<template>
  <a-modal v-model:visible="visible" title="消息详情" @cancel="confirm"
           width="600px"  :destroy-on-close="true">
  <template #footer>
     <a-button type="primary" @click="confirm">
        确定
     </a-button>
  </template>

    <a-form :model="record" :label-col="{span:4}">
      <a-form-item label="标题" style="font-weight: bold">
        {{record.title}}
      </a-form-item>

      <a-form-item label="时间">
        {{record.datetime}}
      </a-form-item>

      <a-form-item label="内容">
        {{record.content}}
      </a-form-item>
    </a-form>



  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance} from "ant-design-vue";

import {messageApi} from "@/api/message";


const record = reactive({
  title: "",
  datetime: "",
  content: "",
})

const visible = ref(false)
const form = ref<FormInstance>()

const emit = defineEmits(['loadTableData'])

function showModal(messageID: number) {
  visible.value = true
  messageApi.get({id: messageID}).then(
      res => {
        record.title = res.data?.title
        record.datetime = res.data?.datetime
        record.content = res.data?.content
      }
  )
}

function confirm() {
  visible.value = false
  emit('loadTableData')
}


defineExpose({showModal,})

</script>

<style lang="scss" scoped>
//调整form表单的行间距
:deep(.ant-form-item) {
  margin-bottom: 10px;
}
</style>
