<template>
  <a-menu mode="vertical" theme="dark">
      <!--第一次遍历-->
      <template v-for="item1 in menuList">
        <!--如果没有子菜单，直接展示标签-->
        <a-menu-item class="menu-item" v-if="!item1.children" :key="item1.label">
          <router-link :to="item1.path">
            {{ item1.label }}
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else :key="item1.label">
          <template #title>{{ item1.label }}</template>
          <!--如果有子菜单，就进行第二次遍历-->
          <template v-for="item2 in item1.children">
            <!--如果没有子菜单，直接展示标签-->
            <a-menu-item class="menu-item" v-if="!item2.children" :key="item2.label">
              <router-link :to="item1.path + item2.path">
                {{ item2.label }}
              </router-link>
            </a-menu-item>
            <!--如果有子菜单，就进行第三次遍历-->
            <a-sub-menu v-else :key="item2.label">
              <template #title>{{ item2.label }}</template>
              <div v-for="item3 in item2.children">
                <!--如果没有子菜单，直接展示标签-->
                <a-menu-item class="menu-item" :key="item3.label">
                  <router-link :to="item1.path + item2.path + item3.path">
                    {{ item3.label }}
                  </router-link>
                </a-menu-item>
              </div>
            </a-sub-menu>
          </template>
        </a-sub-menu>
      </template>
  </a-menu>
</template>

<script setup lang="ts">
import {menuList} from "@/components/sider/menu";
import useGlobalStore from "@/store/global";
import {storeToRefs} from "pinia";

const globalState = useGlobalStore()
const {isCollapsed} = storeToRefs(globalState)

</script>

<style scoped lang="scss">

</style>
