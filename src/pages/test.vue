<template>
  <div>这是test.vue</div>
  <div> &nbsp;</div>

  <div><a-button type="primary">sdf</a-button></div>
  <div>可以查看控制台日志</div>
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
