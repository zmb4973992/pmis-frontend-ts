<template>
  这里是home页面
  <br />
  <router-link :to="{name:'login'}">点击跳转至login页面</router-link>
  <br /><br />
  <router-link :to="{name:'test'}">点击跳转至test页面</router-link>
  <br /><br />

  <a-button type="primary" @click="jump">home页面 测试按钮</a-button>
  <div>
  <a-rate v-model:value="value"/>
  </div>
    <div class="test">测试less</div>
  <br /><br />
  <router-view/>





</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import userUserStore from "../store/user";

const router = useRouter()

let value = ref(3)
const user = userUserStore()


const jump = () => {
  router.push({name: 'test'})
  user.updateToken('11111')
  console.log(user.token)
}



</script>

<style scoped lang="less">
.test {
  color: red;
}
</style>
