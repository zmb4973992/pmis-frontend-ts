<template>
  <div class="right-header">
    <a-tooltip class="message-center">
      <template #title>{{ messages }}</template>
      <a-badge class="badge" :count="numberOfUnreadMessages" :overflow-count="9" title="">
        <bell-outlined class="bell" @click="jumpToMessageCenter"/>
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
const jumpToMessageCenter = () => router.push({name: '消息中心'})
let numberOfUnreadMessages = ref(811)
let messages = numberOfUnreadMessages.value > 0 ? numberOfUnreadMessages.value + '条未读消息，点击查看' : '消息中心'

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

//调整通知铃铛的样式
:deep(.bell) {
  font-size: 17px;
  color: #848587;
}

//调整徽标的样式
:deep(.ant-badge-count) {
  height: 13px;
  line-height: 13px;
  padding: 0 4px;
}

:deep(.ant-dropdown-menu-item) {
  text-align: center;
}

</style>
