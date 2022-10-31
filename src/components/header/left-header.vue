<template>
  <div class="left-header">
    <div class="collapse-button" @click="globalState.changeCollapseStatus()">
      <!--如果折叠状态为否，就展示向内折叠的图标-->
      <MenuFoldOutlined v-if="!isCollapsed"/>
      <!--如果折叠状态为是，就展示向外展开的图标-->
      <MenuUnfoldOutlined v-else/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons-vue";
import {storeToRefs} from "pinia";
import useGlobalStore from "@/store/global";

const globalState = useGlobalStore()
const {isCollapsed} = storeToRefs(globalState)

</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.left-header {
  margin-left: 10px;
  font-size: 21px;

  .collapse-button {
    color: #1890ff;
  }
}
</style>
