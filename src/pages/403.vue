<template>
  <div class="container">
    <img src="@/assets/images/403.png" class="img-403" alt="403"/>
    <div class="content">
      <div class="first-line">403</div>
      <div class="second-line">抱歉，您无权访问该页面~🙅‍♂️🙅‍♀️</div>
      <a-button type="primary" @click="backToHomePage">返回首页</a-button>
      <a-button type="primary" @click="logout">退出登录</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {backToHomePage, logout} from "@/utils/frequent_function";
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  .img-403 {
    margin-right: 120px;
  }

  .content {
    .first-line {
      font-size: 70px;
      color: #434e59;
    }

    .second-line {
      margin: 30px 0 30px;
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

