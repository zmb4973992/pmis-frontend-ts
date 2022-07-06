<template>
  这里是home组件
  <a-button type="primary">Primary Button</a-button>
  <a-rate v-model:value="value"/>
  <div class="test">测试less</div>


</template>

<script setup lang="ts">
import {ref} from 'vue'

let value = ref(3)
</script>

<style scoped lang="less">
.test {
  color: yellow;
  background: red;
}
</style>
