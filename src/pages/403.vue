<template>
  <a-result status="403" title="403" sub-title="抱歉，你没有访问权限">
    <template #extra>
      <a-button type="primary" @click="backToHome">回到首页</a-button>
      <a-button type="primary" @click="logout">退出</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import router from "@/router";
import {reactive} from "vue";

const backToHome = () => {
  router.push({name:'home'})
}

const logout = () => {
  localStorage.removeItem('access_token')
  router.push({name: 'login'})
}

</script>

<style scoped lang="scss">

</style>
