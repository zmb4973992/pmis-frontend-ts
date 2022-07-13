<template>
  <div class="layout">
    <div class="login-container">
      <div class="chinese_title">
        中文标题
      </div>
      <div class="english_title">
        English Name
      </div>
      <br><br>
      <a-form class="my_form"
          :model="formState"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item class="username_setting"
            label="Username"
            name="username"
            :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username"/>
        </a-form-item>

        <a-form-item
            class="password_setting"
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password"/>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
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
  box-shadow: 0 21px 41px 0 rgba(0, 0, 0, 0.2);
}

.chinese_title {
  margin-top: 20px;
  font-size: 30px;
}

.english_title {
  margin-top: 20px;
  font-size: 15px;
}

.my_form {
  margin: auto 50px auto 40px;
}

</style>
