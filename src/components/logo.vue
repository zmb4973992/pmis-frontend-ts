<template>
  <div class="logo-layout">

    <div v-if="!isCollapsed" class="chinese-title">
      项目管理信息系统
    </div>
    <div v-else class="english-title">
      PMIS
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

  .chinese-title {
    font-size: 14px;
    line-height: 35px; //line-height = height时，行内文字垂直居中
    //默认居中对齐，所以不用text-align
  }

  .english-title {
    font-size: 20px;
    line-height: 35px;
    text-align: center;
  }
}


</style>
