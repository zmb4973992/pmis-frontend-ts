<template>
  <!--版面总图-->
    <div class="layout">
        <!--登录框-->
        <div class="login-box">
            <!--中文标题-->
            <div class="chinese-title">
                中文标题
            </div>
            <!--英文标题-->
            <div class="english_title">
                English Title
            </div>
            <br><br>
            <!--登录表单-->
            <a-form name="login" :model="formState" :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 19 }" autocomplete="off" @finish="onFinish"
                    @finishFailed="onFinishFailed">

                <a-form-item label="用户名：" name="username"
                             :rules="[{ required: true, message: '请输入用户名！' }]">
                    <a-input v-model:value="formState.username"/>
                </a-form-item>

                <a-form-item class="password_setting" label="密码：" name="password"
                             :rules="[{ required: true, message: '请输入密码' }]">
                    <a-input-password v-model:value="formState.password"/>
                </a-form-item>

                <a-form-item class="login-button" :wrapper-col="{ offset: 10, span: 16 }">
                    <a-button class="login-button" type="primary" html-type="submit">登录</a-button>
                </a-form-item>

            </a-form>
        </div>
    </div>


</template>

<script setup lang="ts">
import {reactive} from "vue";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";
import {login} from "@/api/login";
import {routeName} from "@/utils/routeName";

const router = useRouter()

const formState = reactive({
    username: '',
    password: '',
})

const onFinish = (data: any) => {
    login(data).then(
        // 如果请求成功发出
        res => {
            if (res.code === 0) {
                message.success('登录成功，正在跳转......', 1)
                router.push({name: routeName.homePage})
            } else {
                message.error('用户名或密码错误')
            }
        },
        //如果请求发送失败
        err => (console.log(err))
    )
};
const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

</script>

<style scoped lang="scss">
.layout {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom, rgb(13, 56, 57), rgb(190, 228, 238));
  display: flex; //容器内的子元素实施弹性布局
  justify-content: center; //水平布局
  align-items: center; //垂直布局
}

.login-box {
  width: 500px;
  height: 400px;
  //线性渐变背景色，方向-起始颜色-终止颜色
  background: linear-gradient(to bottom, RGB(110, 169, 237), rgb(190, 220, 238));
  border-radius: 20px; //边框圆角
  box-shadow: 0 21px 41px 0 rgba(0, 0, 0, 0.3); //边框阴影
}

.chinese-title {
  margin-top: 20px;
  font-size: 30px;
  text-align: center;
}

.english_title {
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
}

.ant-form {
  margin: auto 50px auto 40px;
  height: 170px;

  .username_setting, .password_setting {
    height: 40px;
  }
}


</style>
