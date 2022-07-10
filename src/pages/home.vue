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
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import userUserStore from "@/store/user";

const router = useRouter()

let value = ref(3)
const user = userUserStore()


const jump = () => {
  router.push({name: 'test'})
  user.updateToken('11111')
  console.log(user.token)
}



</script>

<style scoped lang="less">
.layout {
  height: 100vh;
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
  background: cornsilk ;
}
</style>
