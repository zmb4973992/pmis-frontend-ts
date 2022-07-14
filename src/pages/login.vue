<template>
  <!--版面总图-->
  <div class="layout">
    <!--登录框-->
    <div class="login-container">
      <!--中文标题-->
      <div class="chinese_title">
        中文标题
      </div>
      <!--英文标题-->
      <div class="english_title">
        English Name
      </div>
      <br><br>
      <!--登录表单-->
      <a-form
          class="my_form"
          name="login"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            class="username_setting"
            label="用户名："
            name="username"
            :rules="[{required: true, message: '请输入用户名'}]"
        >
          <a-input v-model:value="formState.username"/>
        </a-form-item>

        <a-form-item
            class="password_setting"
            label="密码："
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password v-model:value="formState.password"/>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>


  </div>


</template>

<script setup lang="ts">
import {reactive} from "vue";
import request from "@/util/axios";
import userUserStore from "@/store/user";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";

const user = userUserStore()
const router = useRouter()

const formState = reactive({
  username: '',
  password: '',
})

const onFinish = (data: any) => {
  request.post('/api/login', data).then((res) => {
    // 如果返回的状态码不是0
    if (res.data.code !== 0) {
      message.error('用户名或密码错误')
      return
    }
    message.success('登录成功，正在跳转......', 1)
    user.updateToken(res.data.data.access_token)
    router.push({name: 'home'})
    localStorage.setItem('access_token', res.data.data.access_token)
    return;
  })
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};


</script>

<style scoped lang="less">
.layout {
  height: 100vh;
  //background-color: cornflowerblue;
  //线性渐变背景色，方向-起始颜色-终止颜色
  background: linear-gradient(to bottom, cornflowerblue, rgb(190, 220, 238));
  display: flex;
  justify-content: center; //水平布局
  align-items: center; //垂直布局
}

.login-container {
  width: 500px;
  height: 400px;
  //线性渐变背景色，方向-起始颜色-终止颜色
  background: linear-gradient(to bottom, RGB(110, 169, 237), rgb(190, 220, 238));
  border-radius: 20px; //边框圆角
  box-shadow: 0 21px 41px 0 rgba(0, 0, 0, 0.3); //边框阴影
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

.test {
  margin: auto;
}


</style>
