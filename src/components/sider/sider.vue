<template>
  <a-menu mode="vertical" theme="dark">
    <sider-for-recursion :routes="routes"/>
  </a-menu>
</template>

<script setup lang="ts">
import SiderForRecursion from "@/components/sider/component/sider-for-recursion.vue";
import routes, {customRouteRecord} from "@/router/routes";


</script>

<style scoped lang="scss">

</style>
