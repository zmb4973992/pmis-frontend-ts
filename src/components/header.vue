<template>
  <div class="left-header">
      <LeftOutlined/>

  </div>
  <div class="right-header">右边的header</div>
</template>

<script setup lang="ts">
import {LeftOutlined} from "@ant-design/icons-vue";
</script>

<style scoped lang="less">
.left-header {
  float: left;
}

.right-header {
  float: right;
}
</style>
