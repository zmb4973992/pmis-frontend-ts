<template>
  <a-layout class="layout">
    <a-layout-sider width="180px">
      <Logo></Logo>
      <Sider></Sider>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>顶栏</a-layout-header>
      <a-layout-content>内容区域</a-layout-content>
    </a-layout>
  </a-layout>


</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import userUserStore from "@/store/user";
import request from "@/util/axios";
import {getUserInfo} from "@/api/get_userinfo";
import Sider from '@/components/Sider.vue'  //侧边栏组件
import Logo from '@/components/Logo.vue'


const router = useRouter()

const user = userUserStore()

onMounted(() => {
  request.post('/api/login', {
    username: 'aaa',
    password: 'bbb',
  });
  //测试
  getUserInfo(14).then(res => (console.log(res.data.roles)))
})

</script>

<style scoped lang="less">
.layout {
  height: 100vh;
  width: 100vw;
  .ant-layout-sider {
    background: burlywood;
  }
}



.ant-layout-header {
  background: cornflowerblue;
  height: 50px;
}

.ant-layout-content {
  background: antiquewhite;
}

.ant-layout-footer {
  background: cornsilk;
}
</style>
