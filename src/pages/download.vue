<template>


</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {fileApi} from "@/api/file";

const route = useRoute()
const fileID = route.params.fileID

fileApi.download(Number(fileID))

</script>

<style scoped lang="scss">

</style>
