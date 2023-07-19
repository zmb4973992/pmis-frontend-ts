<template>
  <a-modal v-model:visible="visible" :after-close="resetForm" title="新增相关方信息"
           width="600px" @ok="onSubmit" :destroy-on-close="true">
    <a-form ref="form" :model="relatedPartyDetail" :label-col="{span:4}">
      <a-form-item label="名称" name="name"
                   :rules="[{ required: true, message: '请填写相关方名称' }]">
        <a-input v-model:value="relatedPartyDetail.name"/>
      </a-form-item>

      <a-form-item label="英文名称" name="englishName">
        <a-input v-model:value="relatedPartyDetail.englishName"/>
      </a-form-item>

      <a-form-item label="统一码" name="uniformSocialCreditCode">
        <a-input v-model:value="relatedPartyDetail.uniformSocialCreditCode"/>
      </a-form-item>

      <a-form-item label="地址" name="address">
        <a-input v-model:value="relatedPartyDetail.address"/>
      </a-form-item>

      <a-form-item label="电话" name="telephone">
        <a-input v-model:value="relatedPartyDetail.telephone"/>
      </a-form-item>

      <a-form-item label="备注" name="remarks">
        <a-textarea v-model:value="relatedPartyDetail.remarks"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {relatedPartyApi} from "@/api/related-party";
import {FormInstance, message} from "ant-design-vue";
const visible = ref(false)

const emits = defineEmits(['loadTableData'])

let relatedPartyDetail = reactive({
  name: '',
  englishName: '',
  address: '',
  uniformSocialCreditCode: '',
  telephone: '',
  remarks: '',
})

async function showModal() {
  form.value?.resetFields()
  visible.value = true
}

function resetForm() {
  //记得还要修改不在reactive里的数据
  Object.keys(relatedPartyDetail).map(key => {
    delete relatedPartyDetail[key as keyof typeof relatedPartyDetail]
  })
}

const form = ref<FormInstance>()

function onSubmit() {
  form.value?.validateFields().then(
      async () => {
        try {
          let res = await relatedPartyApi.create({
            name: relatedPartyDetail.name,
            english_name: relatedPartyDetail.englishName,
            address: relatedPartyDetail.address,
            uniform_social_credit_code: relatedPartyDetail.uniformSocialCreditCode,
            telephone: relatedPartyDetail.telephone,
            remarks: relatedPartyDetail.remarks,
          })
          if (res.code === 0) {
            message.success("添加成功")
            emits("loadTableData")
            visible.value = false
          }
        } catch (e: any) {
          console.log(e)
          message.warn(e)
        }
      }
  )
}

defineExpose({
  showModal,
})
</script>

<style scoped lang="scss">

</style>
