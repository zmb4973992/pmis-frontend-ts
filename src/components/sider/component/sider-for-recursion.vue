<template>
  <template v-for="menu of props.routes">
    <template v-if="!menu.meta?.hidden">
      <!--如果该route有子route-->
      <a-sub-menu v-if="menu.children" :key="menu.name">
        <template #icon v-if="menu.meta?.icon">
          <component :is="menu.meta.icon"/>
        </template>
        <template #title>{{ menu.meta?.label }}</template>
        <sider-for-recursion :routes="menu.children"/>
      </a-sub-menu>
      <!--如果该route没有子route-->
      <a-menu-item v-else :key="menu.name">
        <template #icon v-if="menu.meta?.icon">
          <component :is="menu.meta.icon"/>
        </template>
        <router-link :to="{name: menu.name}">
          <span>{{ menu.meta?.label }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </template>

</template>
<script setup lang="ts">
import {customRouteRecord} from "@/router/routes";

const props = defineProps<{ routes: customRouteRecord[] }>()

</script>

<style scoped lang="scss">
</style>

