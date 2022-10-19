<template>
  <div class="a">
    <a-table :dataSource="dataSource" :columns="columns"/>
  </div>
</template>
<script setup lang="ts">

const dataSource = [
  {

    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
    test: 'kskdf',
  },
  {

    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {

    name: '成龙',
    age: 42,
    address: '西湖区222湖底公园1号',
  },
]
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',

  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
  },
  {
    title: '测试',
    dataIndex: 'test',
  },
]
</script>


<style scoped lang="scss">
.a {
  width: 90%;
  margin: 20px auto 0 ; //上 左右 下
}
</style>
