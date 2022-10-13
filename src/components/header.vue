<template>
  <div class="left-header">
    <a-button type="primary" class="collapse-button" @click="layoutSettings.changeCollapseStatus()">
      <!--如果折叠状态为否，就展示向内折叠的图标-->
      <MenuFoldOutlined class="collapse-icon" v-if="!isCollapsed"/>
      <!--如果折叠状态为是，就展示向外展开的图标-->
      <MenuUnfoldOutlined class="collapse-icon" v-else/>
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
import {MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined} from "@ant-design/icons-vue";
import {storeToRefs} from "pinia";
import useLayoutStore from "@/store/layout";

const layoutSettings = useLayoutStore()
const {isCollapsed} = storeToRefs(layoutSettings)

const changeCollapseStatus = () => {
  layoutSettings.changeCollapseStatus()
}

</script>

<style scoped lang="less">
.left-header {
  margin-left: 5px;
  display: flex;

  .collapse-button {
    margin: 0;
    padding: 0 10px;

    .collapse-icon {
      color: white;
      font-size: 18px
    }
  }
}

.right-header {
  padding-right: 15px;

  .dropdown {
    color: white;
  }
}


</style>
