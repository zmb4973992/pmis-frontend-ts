<template>
  <a-menu mode="vertical">
    <!--第一次遍历-->
    <template v-for="item1 in menuList">
      <!--如果没有子菜单，直接展示标签-->
      <a-menu-item class="menu-item" v-if="item1.children.length === 0" :key="item1.label">
        <router-link :to="item1.path">
          {{ item1.label }}
        </router-link>
      </a-menu-item>
      <a-sub-menu v-else :key="item1.label">
        <template #title>{{ item1.label }}</template>
        <!--如果有子菜单，就进行第二次遍历-->
        <template v-for="item2 in item1.children">
          <!--如果没有子菜单，直接展示标签-->
          <a-menu-item class="menu-item" v-if="item2.children.length === 0" :key="item2.label">
            <router-link :to="item1.path + item2.path">
              {{ item2.label }}
            </router-link>
          </a-menu-item>
          <!--如果有子菜单，就进行第三次遍历-->
          <a-sub-menu v-else :key="item2.name">
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
import {reactive, toRefs} from 'vue';
import router from "@/router";
import {MenuProps} from "ant-design-vue";
import {createFromIconfontCN} from "@ant-design/icons-vue";


const state = reactive({
  selectedKeys: [],
  openKeys: [],
});

//如果没有子菜单，记得加上children: []，否则报错
const menuList = [
  {
    path: '/progress',
    label: '进度',
    children: [
      {
        path: '/disassembly',
        label: '拆解项目',
        children: [],
      },
      {
        path: '/status',
        label: '当前情况',
        children: [],
      },
      {
        path: '/snapshot',
        label: '历史快照',
        children: [],
      },
      {
        path: '/warning',
        label: '进度预警',
        children: [],
      },
      {
        path: '/update_log',
        label: '更新日志',
        children: [],
      },
    ],
  },
  {
    path: '/project',
    label: '项目',
    children: [
      {
        path: '/list',
        label: '项目列表',
        children: [],
      },
        {
        path: '/performance',
        label: '历史业绩',
        children: [],
      },
      {
        path: '/member',
        label: '成员管理',
        children: [],
      },
    ],
  },
  {
    path: '/related-party',
    label:'相关方',
    children: [
      {
        path: '/list',
        label: '相关方列表',
        children: [],
      },
    ],
  },
]


</script>

<style scoped lang="less">

</style>
