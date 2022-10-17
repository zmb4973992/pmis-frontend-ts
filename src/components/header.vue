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
        {{ full_name }}测试
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
import useUserStore from "@/store/user";
import {GetUser} from "@/api/user";
import {onMounted} from "vue";

const layoutSettings = useLayoutStore()
const {isCollapsed} = storeToRefs(layoutSettings)
let full_name: string

async function getUserInfo() {
  let userInfo = await GetUser()
  let full_name = userInfo.data.full_name
  console.log(full_name)
}

getUserInfo()


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
