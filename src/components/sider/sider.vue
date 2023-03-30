<template>
    <a-menu mode="vertical" theme="dark">
        <template v-for="menu of props.menuList">
            <a-sub-menu v-if="menu.children" :key="menu.label" class="menu-item">
                <template #icon>
                    <component :is="menu.icon as string"/>
                </template>
                <template #title>{{ menu.label }}</template>
                <sider :menuList="menu.children"/>
            </a-sub-menu>
            <a-menu-item v-else :key="menu.label">
                <template #icon>
                    <component :is="menu.icon as string"/>
                </template>
                <router-link :to="menu.path">
                    <span>{{ menu.label }}</span>
                </router-link>
            </a-menu-item>
        </template>
    </a-menu>
</template>

<script setup lang="ts">
import useGlobalStore from "@/store/global";
import {storeToRefs} from "pinia";
import {menuFormat} from "@/components/interface/menu";

const globalState = useGlobalStore()
const {isCollapsed} = storeToRefs(globalState)

const props = defineProps<{
    menuList: menuFormat[]
}>()

</script>

<style scoped lang="scss">

</style>
