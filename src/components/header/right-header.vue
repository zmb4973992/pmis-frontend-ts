<template>
  <div class="right-header">
    <a-tooltip class="message-center">
      <template #title>{{ messages }}</template>
      <a-badge class="badge" :count="numberOfUnreadMessages" :dot="dot">
        <bell-outlined @click="click"/>
      </a-badge>
    </a-tooltip>

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
          <a-menu-divider :style="{margin:'7px'}"/>
          <a-menu-item>
            <a href="javascript:" @click="logout">退出登录</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import {DownOutlined, BellOutlined} from "@ant-design/icons-vue";
import useUserStore from "@/store/user";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import {useRouter} from "vue-router";

const user = useUserStore()
const {full_name} = storeToRefs(user)
const router = useRouter()

const logout = () => {
  localStorage.removeItem('access_token')
  router.push({name: 'login'})
}
const click = () => alert('点击测试')
let numberOfUnreadMessages = ref(8)
let messages = numberOfUnreadMessages.value > 0 ? numberOfUnreadMessages.value + '条未读消息' : '消息中心'
const dot = numberOfUnreadMessages.value > 0

</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.right-header {
  padding-right: 15px;
  height: 35px;
  line-height: 35px;

  .message-center {
    margin-right: 20px;
  }

  .dropdown {
    color: #222222;
  }
}
</style>
