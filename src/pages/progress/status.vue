<template>
  <div id="layout1"/>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted} from "vue";

onMounted(() => {
  let chart1 = echarts.init(
      document.getElementById('layout1') as HTMLElement)
  chart1.setOption({
    title: {
      text: '圆环图的例子',
      left: 'center',
      top: 'center'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
        },
        data: [
          {
            value: 1548,
            name: 'C'
          },
          {
            value: 335,
            name: 'A'
          },
          {
            value: 234,
            name: 'B'
          },

        ],
        radius: ['40%', '70%']
      }
    ]
  })
  window.addEventListener("resize", () => chart1.resize())

})


</script>

<style scoped lang="scss">
#layout1 {
  height: 300px;
  width: 100%;
  background-color: antiquewhite;
}
</style>
