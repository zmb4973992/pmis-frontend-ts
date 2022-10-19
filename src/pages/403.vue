<template>
  <a-result status="403" title="403" sub-title="抱歉，你没有访问权限">
    <template #extra>
      <a-button type="primary" @click="backToHome">回到首页</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import router from "@/router";
import {reactive} from "vue";
const backToHome = () => {
  router.push({name:'home'})
}

</script>

<style scoped lang="scss">

</style>
