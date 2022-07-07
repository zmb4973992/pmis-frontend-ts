<template>
  这里是home组件
  <a-button type="primary" @click="jump">Primary Button</a-button>
  <a-rate v-model:value="value"/>
  <div class="test">测试less</div>


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
  user.updateToken('123')
  console.log(user.token)
}



</script>

<style scoped lang="less">
.test {
  color: yellow;
  background: red;
}
</style>
