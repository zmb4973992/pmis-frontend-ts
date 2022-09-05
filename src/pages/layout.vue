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
import Sider from '@/components/Sider.vue'  //侧边栏组件
import Logo from '@/components/Logo.vue'
import {getUserInfo} from "@/api/user";
import {IRelatedParty, GetRelatedParty, UpdateRelatedParty,createRelatedParty} from "@/api/related_party";


const router = useRouter()

const user = userUserStore()

onMounted(() => {
  request.post('/api/login', {
    username: 'aaa',
    password: 'bbb',
  });
  //测试
  // getUserInfo(14).then(res => (console.log(res.data.data.employee_number)))
  // getRelatedParty(33).then(res => (console.log(res.data.data.address)))

  let param: IRelatedParty = {
    chinese_name: '附件二123',
    english_name: 'fine111',
    address: '看到飞机上的分1111开久了',
    uniform_social_credit_code: '388d3kg712123kd',
    telephone: '1383991111148374'
  }
  // let relatedPartyID = 33
  // UpdateRelatedParty(relatedPartyID, param).then(res => (console.log(res.data)))

  createRelatedParty(param).then(res => (console.log(res.data)))

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
