<template>
  <div class="not-container">
    <img src="@/assets/images/403.png" class="not-img" alt="403" />
    <div class="not-detail">
      <h2>403</h2>
      <h4>抱歉，您无权访问该页面~🙅‍♂️🙅‍♀️</h4>
      <a-button  type="primary" @click="router.push({name:'home'})">返回首页</a-button>
      <a-button  type="primary" @click="logout">退出登录</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const logout = () => {
  localStorage.removeItem('access_token')
  router.push({name: 'login'})
}
</script>

<style scoped lang="scss">
.not-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  .not-img {
    margin-right: 120px;
  }
  .not-detail {
    h2,
    h4 {
      padding: 0;
      margin: 0;
    }
    h2 {
      font-size: 70px;
      color: #434e59;
    }
    h4 {
      margin: 30px 0 20px;
      font-size: 26px;
      font-weight: normal;
      color: #848587;
    }
    .ant-btn {
      width: 100px;
      margin-right: 40px;
    }
  }
}

</style>

