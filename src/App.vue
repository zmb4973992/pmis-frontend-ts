<template>
  <a-config-provider :locale="zhCN">
    <a-spin :spinning="false" size="large" tip="稍等片刻，正在拼命加载中...">
    <router-view/>
    </a-spin>
  </a-config-provider>
</template>

<script lang="ts" setup>
// 这里必须使用国际化，否则有些组件会显示为英文，比如分页器
import zhCN from 'ant-design-vue/es/locale/zh_CN';

</script>

<style scoped lang="scss">

</style>
