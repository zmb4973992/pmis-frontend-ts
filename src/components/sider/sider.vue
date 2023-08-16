<template>
<!--  <a-menu mode="vertical" theme="dark">-->
<!--    <sider-for-recursion :routes="routes"/>-->
<!--  </a-menu>-->

  <a-menu mode="inline" theme="dark" :inline-indent="14"
          v-model:selectedKeys="selectedKeys">
        <sider-for-recursion :routes="routes"/>
  </a-menu>
</template>

<script setup lang="ts">
import SiderForRecursion from "@/components/sider/component/sider-for-recursion.vue";
import routes from "@/router/routes";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const selectedKeys = ref<string[]>([])



</script>

<style scoped lang="scss">

</style>
