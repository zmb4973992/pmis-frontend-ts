<template>
  <a-layout class="layout">
    <!--左侧边栏-->
    <a-layout-sider
        class="layout-sider"
        :width="layoutSettings.isCollapsed? '80px':'140px'">
      <Logo/>
      <Sider/>
    </a-layout-sider>
    <!--右侧内容区域-->
    <a-layout>
      <!--header区域-->
      <a-layout-header class="layout-header">
        <Header/>
      </a-layout-header>

      <!--content区域-->
      <a-layout-content class="layout-content">
        <router-view>
        </router-view>
      </a-layout-content>

    </a-layout>

  </a-layout>


</template>

<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import useUserStore from "@/store/user";
import request from "@/util/axios";
import Sider from '@/components/Sider.vue'  //侧边栏组件
import Logo from '@/components/Logo.vue'
import Header from '@/components/header.vue'
import {
  GetUser,
  IUpdateUser,
  ICreateUser,
  UpdateUser,
  CreateUser, DeleteUser, GetUserList, IUserList
} from "@/api/user";

import {
  IRelatedParty,
  GetRelatedParty,
  UpdateRelatedParty,
  CreateRelatedParty,
  DeleteRelatedParty, IRelatedPartyList, GetRelatedPartyList
} from "@/api/related_party";
import {
  GetDepartment,
  UpdateDepartment,
  CreateDepartment,
  DeleteDepartment,
  GetDepartmentList,
  IDepartment,
  IDepartmentList
} from "@/api/department";
import {
  GetDisassembly,
  UpdateDisassembly,
  CreateDisassembly,
  CreateDisassemblyInBatches,
  DeleteDisassembly,
  GetDisassemblyList,
  IDisassembly,
  IDisassemblyList,
} from "@/api/disassembly";
import {storeToRefs} from "pinia";
import useLayoutStore from "@/store/layout";
import {log} from "util";


const router = useRouter()
const user = useUserStore()
let layoutSettings = useLayoutStore()

GetUser(14).then(res => {
  console.log(res.data)
})

//不是所有功能都要放在onMounted下，直接放在外面一样可以运行
onMounted(() => {
      request.post('/api/login', {
        username: 'a',
        password: 'a',
      });
    }
)


</script>

<style scoped lang="less">
.layout {
  //确保页面铺满视窗
  height: 100vh;
  width: 100vw;

  .layout-sider {
    background-color: white;
  }

  .layout-header {
    background-color: #1890ff;
    height: 35px;
    //取消所有的内边距
    padding: 0;
    //该盒子实行弹性布局
    display: flex;
    //均匀排列每个元素
    //首个元素放置于起点，末尾元素放置于终点
    justify-content: space-between;
    align-items: center;
  }

  .layout-content {
    //内容区域以浅灰色为底色
    background: rgba(255, 255, 255, 0.3);
    padding: 10px;
  }
}


</style>
