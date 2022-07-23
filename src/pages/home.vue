<template>
  <a-layout class="layout">
    <a-layout-sider>Sider</a-layout-sider>
    <a-layout>
      <a-layout-header>Header</a-layout-header>
      <a-layout-content>Content</a-layout-content>
    </a-layout>
  </a-layout>


</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import userUserStore from "@/store/user";
import request from "@/util/axios";
import {getUserInfo} from "@/api/get_userinfo";

const router = useRouter()

let value = ref(3)
const user = userUserStore()

onMounted(() => {
  request.post('/api/login', {
    username: 'aaa',
    password: 'bbb',
  });
  getUserInfo(14).then(res => (console.log(res.data.data.roles)))
})


</script>

<style scoped lang="less">
.layout {
  height: 100vh;
  width: 100vw;
}

.ant-layout-sider {
  background: burlywood;
}

.ant-layout-header {
  background: cornflowerblue;
}

.ant-layout-content {
  background: antiquewhite;
}

.ant-layout-footer {
  background: cornsilk;
}
</style>
