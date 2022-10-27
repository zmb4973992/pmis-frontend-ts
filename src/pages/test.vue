<template>
  <div>这是test.vue</div>
</template>

<script setup lang="ts">
import useUserStore from "@/store/user";
import request from "@/utils/request";

const user = useUserStore()

import {GetRoles} from "@/api/role_and_user"
import {GetUserByID} from "@/api/user";



</script>


<style scoped lang="scss">

</style>
