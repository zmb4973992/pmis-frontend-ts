<template>
  <a-config-provider :locale="zhCN">
    <router-view/>
  </a-config-provider>
</template>

<script lang="ts" setup>
// 这里必须使用国际化，否则有些组件会显示为英文，比如分页器
import zhCN from 'ant-design-vue/es/locale/zh_CN';

</script>

<style scoped lang="scss">

</style>
