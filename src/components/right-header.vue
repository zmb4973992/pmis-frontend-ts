<template>
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
import {DownOutlined} from "@ant-design/icons-vue";
import useUserStore from "@/store/user";
import router from "@/router";
import {storeToRefs} from "pinia";

const user = useUserStore()
const {full_name} = storeToRefs(user)

const logout = () => {
  localStorage.removeItem('access_token')
  router.push({name: 'login'})
}

</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.right-header {
  padding-right: 15px;
  height: 35px;
  line-height: 35px;

  .dropdown {
    color: #222222;
  }
}
</style>
