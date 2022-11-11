<template>
  <a-tree class="tree" :tree-data="treeData" v-model:selectedKeys="selectedKeys">
  </a-tree>
</template>

<script setup lang="ts">
import {TreeProps} from "ant-design-vue";
import {ref, watch} from "vue";

const treeData: TreeProps['treeData'] = [
  {
    title: '我是a',
    key: 'a',
    children: [
      {
        title: '我是a1',
        key: 'a1'
      },
      {
        title: '我是a22',
        key: 'a2'
      }
    ]
  },
  {
    title: '我是b',
    key: 'b'
  }
]

const selectedKeys = ref<string[]>([]);

watch(selectedKeys, () => {
  console.log(selectedKeys.value[0]);
});
</script>

<style scoped lang="scss">
:deep(.tree) {
  background-color: white;
  width: 200px;
  padding: 10px;
}
</style>
