<template>
  <div class="left-header">
    <a-button type="primary" style="margin: 0" @click="toggleCollapsed">
      <MenuUnfoldOutlined v-if="!isCollapsed" style="color:white;font-size:18px"/>
      <MenuFoldOutlined v-else style="color:white;font-size:18px"/>
    </a-button>
  </div>
  <div class="right-header">
    <a-dropdown>
      <a class="dropdown" @click.prevent>
        个人信息
        <DownOutlined/>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a href="javascript:">修改信息</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:">修改密码</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:">退出登录</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import {MenuFoldOutlined,MenuUnfoldOutlined, DownOutlined} from "@ant-design/icons-vue";
import {storeToRefs} from "pinia";
import useLayoutStore from "@/store/layout";

const layoutSettings = useLayoutStore()
const {isCollapsed} = storeToRefs(layoutSettings)
</script>

<style scoped lang="less">
.left-header {
  padding-left: 15px;
  display: flex;
}

.right-header {
  padding-right: 15px;

  .dropdown {
    color: white;
  }
}
</style>
