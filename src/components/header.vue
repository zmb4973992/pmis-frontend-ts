<template>
  <div class="left-header">
      <MenuFoldOutlined :style="{color:'white',fontSize: '22px'}"/>
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
import {MenuFoldOutlined, DownOutlined} from "@ant-design/icons-vue";
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
