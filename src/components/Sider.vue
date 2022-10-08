<template>
  <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      style="width: 180px"
      mode="vertical"
      @click="handleClick"
  >
    <a-menu-item key="1">
      <template #icon>
        <MailOutlined/>
      </template>
      栏目一
    </a-menu-item>
    <a-menu-item key="2">
      <template #icon>
        <CalendarOutlined/>
      </template>
      栏目二
    </a-menu-item>
    <a-sub-menu key="sub1">
      <template #icon>
        <AppstoreOutlined/>
      </template>
      <template #title>栏目三</template>

      <a-menu-item key="3">
        <router-link :to="{name:'table'}">表格测试</router-link>
      </a-menu-item>


      <a-menu-item key="4">选项2</a-menu-item>
      <a-sub-menu key="sub1-2" title="Submenu">
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
      </a-sub-menu>
    </a-sub-menu>
    <a-sub-menu key="sub2">
      <template #icon>
        <SettingOutlined/>
      </template>
      <template #title>Navigation Four</template>
      <a-menu-item key="7">Option 7</a-menu-item>
      <a-menu-item key="8">Option 8</a-menu-item>
      <a-menu-item key="9">Option 9</a-menu-item>
      <a-menu-item key="10">Option 10</a-menu-item>
    </a-sub-menu>
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

</script>

<style scoped lang="less">

</style>
