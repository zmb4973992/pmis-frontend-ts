<template>
  <a-layout class="layout">
    <!--左侧边栏-->
    <a-layout-sider class="left-layout"
                    :width="layoutSettings.isCollapsed? '80px':'120px'">
      <Logo/>
      <!--这里包裹一层div，是为了修改margin、padding、滚动条等，里面才是真正的内容区-->
      <div class="sider-wrapper">
        <Sider class="siderBar"/>
      </div>
    </a-layout-sider>
    <!--右侧内容区域-->
    <a-layout class="right-layout">
      <!--header区域-->
      <a-layout-header class="layout-header">
        <Header/>
      </a-layout-header>
      <!--content区域-->
      <a-layout-content class="layout-content-wrapper">
        <!--这里包裹一层div，是为了修改margin、padding、滚动条等，里面才是真正的内容区-->
        <div class="layout-content">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import Sider from '@/components/Sider.vue'
import Logo from '@/components/Logo.vue'
import Header from '@/components/header.vue'
import useLayoutStore from "@/store/layout";
import {onBeforeMount} from "vue";

const router = useRouter()
let layoutSettings = useLayoutStore()

</script>

<style scoped lang="scss">
.layout {
  overflow: hidden;
  //确保页面铺满视窗
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.3);

  .left-layout {
    .sider-wrapper {
      overflow-x: hidden;
      height: calc(100vh - 35px);
    }
  }

  .right-layout {
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

    .layout-content-wrapper {
      //内容区域以浅灰色为底色
      //margin: 6px;
      //padding: 5px;
      background-color: white;
      overflow-x: hidden;

      .layout-content {
        margin: 6px;
      }

    }
  }


}

</style>
