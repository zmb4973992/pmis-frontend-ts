<template>
  <div class="layout">
    <div class="login-container">
      <div class="chinese_title">
        卡就是对付恐惧
      </div>
      <div class="english_title">
        sdfsdfssfsdfsdfsdfffsd
      </div>
    </div>

  </div>


</template>

<script setup lang="ts">
import {reactive} from "vue";

const formState = reactive({
  username: '',
  password: '',
})

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};


</script>

<style scoped lang="less">
.layout {
  height: 100vh;
  background-color: cornflowerblue;
  display: flex;
}

.login-container {
  margin: auto;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 400px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 21px 41px 0px rgba(0, 0, 0, 0.2);
}

.chinese_title {
  margin-top: 20px;
  font-size: 30px;
}

.english_title {
  margin-top: 20px;
  font-size: 15px;
}


</style>
