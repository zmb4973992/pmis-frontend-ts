<template>
  <a-row :gutter="20" style="margin-left: 0">
    <a-col @click="globalState.changeCollapseStatus()" style="font-size: 21px;color: #1890ff">
      <!--如果折叠状态为否，就展示向内折叠的图标-->
      <template v-if="!isCollapsed">
        <a-tooltip>
          <template #title>收起左侧目录</template>
          <MenuFoldOutlined />
        </a-tooltip>
      </template>

      <!--如果折叠状态为是，就展示向外展开的图标-->
      <template v-else>
        <a-tooltip>
          <template #title>展开左侧目录</template>
          <MenuUnfoldOutlined/>
        </a-tooltip>
      </template>
    </a-col>

  </a-row>
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

</style>
