<template>
  <div class="a">
    <a-tree class="tree" v-if="treeData?.length" :tree-data="treeData"
            v-model:selectedKeys="selectedKeys" :default-expand-all="true"
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

interface treeDataFormat {
  title: string
  key: number
  children: treeDataFormat[] | null
}

let treeData = ref<treeDataFormat[]>([
  {title: 'a', key: 1, children: null},
  {
    title: 'b', key: 2, children: [
      {title: '反倒是考虑对方是考虑对方是考虑对方是考虑对方', key: 3, children: null}
    ]
  },
])

const selectedKeys = ref([]);
</script>

<style scoped lang="scss">
.tree {
  width: 200px;
  overflow: auto;
  .ant-tree-title {
    background-color: burlywood;
    //word-break: break-all;
    //word-wrap: break-word;
  }
}
</style>
