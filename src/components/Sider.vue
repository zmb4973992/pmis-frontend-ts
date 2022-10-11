<template>
  <a-menu
      mode="vertical"
      @click="handleClick"
  >
    <!--第一次遍历-->
    <template v-for="item1 in list">
      <!--如果没有子菜单，直接展示标签-->
      <a-menu-item v-if="item1.children.length === 0" :key="item1.name">
        <router-link :to="item1.path">
          {{ item1.label }}
        </router-link>
      </a-menu-item>
      <a-sub-menu v-else :key="item1.name">
        <template #title>{{ item1.label }}</template>
        <!--如果有子菜单，就进行第二次遍历-->
        <template v-for="item2 in item1.children">
          <!--如果没有子菜单，直接展示标签-->
          <a-menu-item v-if="item2.children.length === 0" :key="item2.name">
            <router-link :to="item2.path">
              {{ item2.label }}
            </router-link>
          </a-menu-item>
          <!--如果有子菜单，就进行第三次遍历-->
          <a-sub-menu v-else :key="item2.name">
            <template #title>{{ item2.label }}</template>
            <div v-for="item3 in item2.children">
              <!--如果没有子菜单，直接展示标签-->
              <a-menu-item :key="item3.name">
                <router-link :to="item3.path">
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
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import type {MenuProps} from 'ant-design-vue';

const state = reactive({
  selectedKeys: [],
  openKeys: [],
});
const handleClick: MenuProps['onClick'] = menuInfo => {
  console.log('click ', menuInfo);
};


const list = [
  {
    path: '/a',
    name: 'test',
    label: '我是a',
    children: [],
  },
  {
    path: '/b',
    name: 'home',
    label: '我是b',
    children: [
      {
        path: '/b1',
        name: 'b1',
        label: '我是b1',
        children: [
          {
            path: '/b111',
            name: 'test',
            label: '我是b111',
            children: [],
          },
        ],
      },
      {
        path: '/b2',
        name: 'b2',
        label: '我是b2',
        children: [],
      },
    ],
  },
  {
    path: '/c',
    name: 'table',
    label: '我是c',
    icon: 'anyondfe',
    index: 3,
    children: [],
  },
]

//过滤菜单的方法，已废弃
const noChildren = () => {
  return list.filter((item) => !item.children)
}
const hasChildren = () => {
  return list.filter((item) => item.children)
}

</script>

<style scoped lang="less">

</style>
