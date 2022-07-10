<template>
  <a-result status="404" title="404" sub-title="抱歉，你访问的页面不存在">
    <template #extra>
      <a-button type="primary" @click="backToHome">回到首页</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import router from "@/router";
const backToHome = () => {
  router.push({name:'home'})
}

</script>

<style scoped>

</style>
