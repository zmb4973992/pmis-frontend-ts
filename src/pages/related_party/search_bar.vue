<template>
  <div class="search-bar">
    <a-input id="chinese-name" placeholder="相关方中文名称">
    </a-input>
    <a-input id="english-name" placeholder="相关方英文名称">
    </a-input>
    <a-button class="button" type="primary" @click="a">
      <template #icon>
        <SearchOutlined/>
      </template>
      搜索
    </a-button>
    <a-button class="button" type="primary">
      <template #icon>
        <RedoOutlined/>
      </template>
      重置
    </a-button>
  </div>
</template>

<script setup lang="ts">
import {SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
const a = () => alert('test ok')
</script>

<style scoped lang="scss">
.search-bar{
  #chinese-name, #english-name {
    width: 160px;
    margin: {
      left: 0;
      right: 10px;
    }
  }
  .button {
    margin-right: 10px;
  }
}



</style>
