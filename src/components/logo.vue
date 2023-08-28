<template>
  <div  class="logo-layout">
    <div class="english-title">
      <span>PMIS</span>
    </div>
    <div v-if="!isCollapsed" class="chinese-title">
      <span>项目管理信息系统</span>
    </div>
  </div>

</template>

<script setup lang="ts">
import useGlobalStore from "@/store/global";
import {computed} from "vue";

const globalStore = useGlobalStore()
const isCollapsed = computed(() => globalStore.isCollapsed)
</script>

<style scoped lang="scss">
.logo-layout {
  height: 35px;
  background-color: #1890ff;
  color: white;
  padding: 0 3px;
  display: flex;
  justify-content: space-around;

  .chinese-title {
    font-size: 12px;
    line-height: 35px; //line-height = height时，行内文字垂直居中
  }

  .english-title {
    font-size: 14px;
    line-height: 35px;
    text-align: center;
  }
}


</style>
