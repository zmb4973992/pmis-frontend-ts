<template>
  <router-view/>
</template>

<script lang="ts" setup>


</script>

<style>
/*去除浏览器自带的样式*/
/** {*/
/*  !*外边距调整为0*!*/
/*  margin: 0;*/
/*  !*内边距调整为0*!*/
/*  padding: 0;*/
/*  !*不显示列表的小原点*!*/
/*  list-style: none;*/
/*  !*不显示文本的下划线*!*/
/*  text-decoration: none;*/
/*  !*不显示元素的外部轮廓线*!*/
/*  outline: none;*/
/*}*/

/* 针对index.html id=app 的部分设置样式
  .为class #为id */
#app {
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
