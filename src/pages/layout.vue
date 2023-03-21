<template>
  <a-layout class="general-layout">
    <!--左侧边栏-->
    <a-layout-sider collapsible :trigger="null" v-model:collapsed="isCollapsed"
                    class="left-layout" :width="isCollapsed? 'any':'140px'">
      <Logo/>
      <Sider class="sider-bar"/>
    </a-layout-sider>
    <!--右侧内容区域-->
    <a-layout class="right-layout">
      <!--header区域-->
      <a-layout-header class="layout-header">
        <Header/>
      </a-layout-header>
      <!--content区域-->
      <a-layout-content class="layout-content">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Sider from '@/components/sider/sider.vue'
import Logo from '@/components/logo.vue'
import Header from '@/components/header/header.vue'
import useGlobalStore from "@/store/global";
import {computed} from "vue";

const globalStore = useGlobalStore()
//这里的值是函数，使用计算属性可以利用缓存、提高性能
const isCollapsed = computed(() => globalStore.isCollapsed)

</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.general-layout {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-color: $background-color;

  //侧边栏收起时，调整侧边栏的宽度
  .ant-layout-sider-collapsed {
    min-width: 50px !important;
    max-width: 50px !important;
  }

  .left-layout {
    background-color: $background-color;
    border-right-width: 1px;
    border-radius: 10px;

    ::-webkit-scrollbar {
      display: none;
    }

    .sider-bar {
      overflow-x: hidden;
      height: calc(100vh - 35px);
      border-right: red;
      box-shadow: 1px 0 4px rgba(0, 21, 41, .08);
      //控制该区块的显示层级，越大的越靠前显示
      //加了才能显示header的阴影效果，否则会被下面的div覆盖
      z-index: 1;
    }
  }

  .right-layout {
    background-color: $background-color;

    .layout-header {
      background-color: white;
      height: 35px;
      padding: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: #f3f3f4 2px solid;
      //box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
      //控制该区块的显示层级，越大的越靠前显示
      //加了才能显示header的阴影效果，否则会被下面的div覆盖
      //z-index: 1;
    }

    .layout-content {
      //内容区域以浅灰色为底色
      background-color: #f3f3f4;
      height: calc(100vh - 35px);
      overflow-x: auto;
      padding: 10px;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
