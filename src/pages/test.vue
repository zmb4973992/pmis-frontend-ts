<template>
  这是test组件
  <button @click="test()"/>
</template>

<script setup lang="ts">
import useUserStore from "@/store/user";
import request from "@/util/axios";

const user = useUserStore()

function test(id: number = 30) {
  request.get('/api/related_party/' + id)
      .then(
          (res) => {
            console.log(res)
          })
}

</script>


<style scoped>

</style>
