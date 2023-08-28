<template>
  <a-config-provider :locale="zhCN">
    <a-spin :spinning="false" size="large" tip="稍等片刻，正在拼命加载中...">
    <router-view/>
    </a-spin>
  </a-config-provider>
</template>

<script setup lang="ts">
// 这里必须使用国际化，否则有些组件会显示为英文，比如分页器
import zhCN from 'ant-design-vue/es/locale/zh_CN';

// dayjs的本地化
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

</script>

<style scoped lang="scss">

</style>
