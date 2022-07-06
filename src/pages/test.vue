<template>
  这是test页面
  {{ user.doubleAge }}
  <button @click="increment"/>
</template>

<script setup lang="ts">
import useUserStore from "../store/user";

const user = useUserStore()
function increment(num:number) {
  user.increment(num)
}

1
</script>



<style scoped>

</style>
