<template>
  <a-layout class="layout">
    <!--左侧边栏-->
    <a-layout-sider
        class="left-layout"
        :width="isCollapsed? '80px':'120px'">
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
      <div class="layout-content-wrapper">
        <a-layout-content>
          <!--这里包裹一层div，是为了修改margin、padding、滚动条等，里面才是真正的内容区-->
          <div class="layout-content">
              <router-view/>
          </div>
        </a-layout-content>
      </div>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import Sider from '@/components/sider/sider.vue'
import Logo from '@/components/logo.vue'
import Header from '@/components/header/header.vue'
import useGlobalStore from "@/store/global";
import {computed, ref} from "vue";
import {GetRelatedPartyList} from "@/api/related-party";

const globalStore = useGlobalStore()
//这里的值是函数，使用计算属性可以利用缓存、提高性能
const isCollapsed = computed(() => globalStore.isCollapsed)

const spinning = ref(true)

const a = () => GetRelatedPartyList().then(() => spinning.value = false)

</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.layout {
  overflow: hidden;
  //确保页面铺满视窗
  width: 100vw;
  height: 100vh;
  background-color: $background-color;

  .left-layout {
    background-color: $background-color;
    border-right-width: 1px;
    border-radius: 10px;

    //左侧边栏的滚动条要细一点，不应用全局样式
    ::-webkit-scrollbar {
      width: 3px;
      height: 3px;
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
      //取消所有的内边距
      padding: 0;
      //该盒子实行弹性布局
      display: flex;
      //均匀排列每个元素
      //首个元素放置于起点，末尾元素放置于终点
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
      //控制该区块的显示层级，越大的越靠前显示
      //加了才能显示header的阴影效果，否则会被下面的div覆盖
      z-index: 1;
    }

    .layout-content-wrapper {
      //内容区域以浅灰色为底色
      background-color: #f3f3f4;
      height: calc(100vh - 35px);
      overflow-x: auto;

      .layout-content {
        margin: 6px;
      }
    }
  }
}

</style>
