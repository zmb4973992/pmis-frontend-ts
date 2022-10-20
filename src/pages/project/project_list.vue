<template>
  这是project_list.vue，项目列表
  <div>
    {{ full_name }}
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/store/user";
import {storeToRefs} from "pinia";

let user = useUserStore()
let {full_name, username} = storeToRefs(user)

</script>

<style scoped lang="scss">


</style>
