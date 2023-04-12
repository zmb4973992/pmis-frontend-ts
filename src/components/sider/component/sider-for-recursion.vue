<template>
    <template v-for="route of props.routes">
        <template v-if="!route.meta?.hidden">
            <!--如果该route有子route-->
            <a-sub-menu v-if="route.children" :key="route.name">
                <template #icon v-if="route.meta?.icon">
                    <component :is="route.meta.icon"/>
                </template>
                <template #title>{{ route.meta?.label }}</template>
                <sider-for-recursion :routes="route.children"/>
            </a-sub-menu>
            <!--如果该route没有子route-->
            <a-menu-item v-else :key="route.name">
                <template #icon v-if="route.meta?.icon">
                    <component :is="route.meta.icon"/>
                </template>
                <router-link :to="{name:route.name}">
                    <span>{{ route.meta?.label }}</span>
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

