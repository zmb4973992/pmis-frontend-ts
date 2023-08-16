<template>
  <a-modal v-model:visible="visible" :after-close="resetForm" title="修改相关方信息"
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

      <a-form-item label="附件" name="files">
        <a-upload v-model:file-list="relatedPartyDetail.files"
                  :before-upload="beforeUpload"
                  name="files"
                  :custom-request="uploadFile"
                  @change="handleChange"
                  :max-count="3">

          <a-button :disabled="uploadDisabled">
            <UploadOutlined/>
            点击上传
          </a-button>

          <div @click.stop style="display: inline-block;padding-left: 10px;">
            单文件<span style="color: red">≤20MB</span>,
            最多添加<span style="color: red">3个</span>,
            限<span style="color: red">jpg/png/pdf</span>格式
          </div>
        </a-upload>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {relatedPartyApi} from "@/api/related-party";
import {FormInstance, message, Upload, UploadChangeParam, UploadProps} from "ant-design-vue";
import {fileApi} from "@/api/file";

interface relatedPartyDetailFormat {
  id: number,
  name: string,
  englishName: string,
  address: string,
  uniformSocialCreditCode: string,
  telephone: string,
  remarks: string,
  files: any[]
}

let relatedPartyDetail = reactive<relatedPartyDetailFormat>({
  id: 0,
  name: '',
  englishName: '',
  address: '',
  uniformSocialCreditCode: '',
  telephone: '',
  remarks: '',
  files: [],
})

async function showModal(relatedPartyID: number) {
  visible.value = true
  const res = await relatedPartyApi.get({id: relatedPartyID})
  try {
    if (res?.code === 0) {
      relatedPartyDetail.id = relatedPartyID
      relatedPartyDetail.name = res.data.name
      relatedPartyDetail.englishName = res.data.english_name
      relatedPartyDetail.address = res.data.address
      relatedPartyDetail.uniformSocialCreditCode = res.data.uniform_social_credit_code
      relatedPartyDetail.telephone = res.data.telephone
      relatedPartyDetail.remarks = res.data.remarks
      relatedPartyDetail.files = []
      if (res.data.files) {
        for (let item of res.data.files) {
          relatedPartyDetail.files.push({
            name: item.name,
            url: "http://localhost:8000/download/" + item.id,
            response: {id: item.id,}
          })
        }
      }

    }
  } catch (e) {
    console.log(e);
  }
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
          const tempFileIDs = []
          for (let item of relatedPartyDetail.files) {
            if (item.response?.id) {
              tempFileIDs.push(item.response.id)
            }
          }
          const fileIDs = tempFileIDs.join(",")

          const res = await relatedPartyApi.update({
            id: relatedPartyDetail.id,
            name: relatedPartyDetail.name,
            english_name: relatedPartyDetail.englishName,
            address: relatedPartyDetail.address,
            uniform_social_credit_code: relatedPartyDetail.uniformSocialCreditCode,
            telephone: relatedPartyDetail.telephone,
            remarks: relatedPartyDetail.remarks,
            file_ids: fileIDs,
          })

          if (res?.code === 0) {
            message.success('修改成功')
            emit('loadTableData')
            visible.value = false
          } else {
            message.error(res?.message || '修改失败')
          }
        } catch (e: any) {
          message.error(e)
        }
      }
  )
}

const uploadFile: UploadProps['customRequest'] = async (options: any) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    let res = await fileApi.upload(formData)
    if (res.code != 0) {
      message.error(res.message)
      options.onError(res.message)
    } else {
      options.onSuccess(res.data, options.file)
    }
  } catch (e: any) {
    message.error(e)
  } finally {
  }
}

function handleChange(info: UploadChangeParam) {
  let resFileList = [...info.fileList]

  resFileList = resFileList.map(file => {
        if (file.response) {
          file.url = "http://localhost:8000/download/" + file.response.id
        }
        return file
      }
  )

  relatedPartyDetail.files = resFileList
}

function beforeUpload(file: any) {
  const isPermittedSize = file.size / 1024 / 1024 < 20
  if (!isPermittedSize) {
    message.error("上传的文件必须小于20MB")
  }

  const isPermittedFormat =
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'application/pdf'

  if (!isPermittedFormat) {
    message.error("只支持jpg/png/pdf格式的文件");
  }

  return (isPermittedSize && isPermittedFormat) || Upload.LIST_IGNORE
}

const uploadDisabled = ref(false)

watch(() => relatedPartyDetail.files, () => {

  uploadDisabled.value = relatedPartyDetail.files?.length > 2;
})


defineExpose({showModal,})

const visible = ref(false)


const emit = defineEmits(['loadTableData'])

</script>

<style scoped lang="scss">

</style>
