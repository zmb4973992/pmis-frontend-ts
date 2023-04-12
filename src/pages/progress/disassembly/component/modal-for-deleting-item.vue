<template>
    <a-modal v-model:visible="visible" title="删除" @ok="onSubmit" style="width: 350px">
        <div>确定要删除“
            <span style="color:red;">{{ disassemblyData.name }}</span>
            ”吗？
        </div>
        <div>该分类和它的子分类都会被删除！</div>
    </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {disassemblyApi} from "@/api/disassembly";
import {message} from "ant-design-vue";

const visible = ref(false)

interface disassemblyItem {
    disassemblyID?: number
    name?: string
    weight?: number
    projectID?: number
    level?: number
    superiorID?: number
}

const emit = defineEmits(['loadData'])

const disassemblyData = reactive<disassemblyItem>({})


async function showModal(disassemblyID: number) {
    visible.value = true
    disassemblyData.disassemblyID = disassemblyID
    let res = await disassemblyApi.get({id: disassemblyID})
    if (res && res?.data) {
        disassemblyData.name = res.data.name
    }
}


async function onSubmit() {
    let res = await disassemblyApi.deleteWithInferiors({id: disassemblyData.disassemblyID as number})
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
