<template>
  <div class="left-header">
    <div class="collapse-button" @click="layoutSettings.changeCollapseStatus()">
      <!--如果折叠状态为否，就展示向内折叠的图标-->
      <MenuFoldOutlined v-if="!isCollapsed"/>
      <!--如果折叠状态为是，就展示向外展开的图标-->
      <MenuUnfoldOutlined v-else/>
    </div>
  </div>
  <div class="right-header">
    <a-dropdown>
      <a class="dropdown" @click.prevent>
        你好，{{ full_name }}
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
            <a href="javascript:" @click="logout">退出登录</a>
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
import {onBeforeMount, onMounted, ref} from "vue";
import {GetRoles} from "@/api/role_and_user";
import router from "@/router";

const layoutSettings = useLayoutStore()
const {isCollapsed} = storeToRefs(layoutSettings)
let full_name = ref('')

onMounted(
    () => {
      GetUser().then(
          (res) => {
            full_name.value = res.data.full_name
          }
      )
    }
)

const logout = () => {
  localStorage.removeItem('access_token')
  router.push({name: 'login'})
}


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

.right-header {
  padding-right: 15px;
  height: 35px;
  line-height: 35px;

  .dropdown {
    color: #222222;
  }
}
</style>
