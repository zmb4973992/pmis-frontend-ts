<template>
  <div id="layout1">
    <div class="left-column">
      <a-select class="project-selector" v-model:value="project_ids"></a-select>
      <a-divider id="divider"/>
      <a-tree class="tree" :show-icon="true" :tree-data="treeData"
              v-model:selectedKeys="selectedKeys">
        <template #title="{title,key}">
          <span class="title">
            {{ title }}
            <span class="actions">
              <a @click.stop="create">
            <PlusOutlined class="action"/></a>
              <a @click.stop="edit"><EditOutlined class="action"/></a>
              <a @click.stop="delete1"><DeleteOutlined class="action"/></a>
          </span>
          </span>
        </template>
      </a-tree>
    </div>


    <div class="right-column">
      <a-tabs id="tabs" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tab 1">
          <div id="chart2"></div>

        </a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render v-if="1">
          <div id="chart1"></div>


        </a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">
          Content of Tab Pane 3
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>


</template>

<script setup lang="ts">
import {TreeProps} from "ant-design-vue";
import {onMounted, ref, watch} from "vue";

const project_ids = ref([])

import {PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons-vue";

let treeData = ref([
  {
    title: '我是a',
    key: 'a',
    children: [
      {
        title: '我是a1',
        key: 'a1'
      },
      {
        title: '我是a2',
        key: 'a2'
      }
    ]
  },
  {
    title: '我是b',
    key: 'b'
  }
])

const click = () => treeData.value.push({title: 'ccc', key: 'c'})

const selectedKeys = ref([]);
const activeKey = ref('1')

watch(selectedKeys, () => {
  console.log(selectedKeys.value[0])
});

// 会有抖动，待解决
// watch(activeKey, () => {
//   let chart1 = echarts.init(document.getElementById('chart1') as HTMLElement)
//   setTimeout(() => chart1.resize(), 0)
// })

import * as echarts from 'echarts';

onMounted(() => {
  let chart1 = echarts.init(document.getElementById('chart1') as HTMLElement)
  let chart2 = echarts.init(document.getElementById('chart2') as HTMLElement)

  chart1.setOption({
    tooltip: {
      trigger: 'item'
    },

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
  chart2.setOption({
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: true,
      data: ['boys', 'girls'],
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'boys',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      },
      {
        name: 'girls',
        data: [480, 932, 401, 534, 1190, 1530, 1520],
        type: 'line',
        smooth: true
      },
    ],
    dataZoom: [
      {
        type: 'slider',
      },
      {
        type: 'inside',
      }
    ],

  })


  window.addEventListener('resize', () => {
    chart1.resize()
    chart2.resize()
  })
})

const create = () => console.log('触发了create')
const edit = () => console.log('触发了edit')
const delete1 = () => console.log('触发了delete1')


</script>

<style scoped lang="scss">
:deep(.tree) {
  width: 100%;
  padding-bottom: 4px;
}

#layout1 {
  overflow-x: auto;

  .left-column {
    float: left;
    width: 220px;
    background-color: white;
    margin-right: 10px;
    padding: 4px 10px 8px 10px;

    .project-selector {
      width: 200px;
      margin: {
        top: 4px;
      }
    }

    .title {
      .actions {
        display: none;

        .action {
          margin-left: 6px;
        }

      }
    }

    .title:hover {
      .actions {
        display: inline
      }
    }

    #divider {
      margin: {
        top: 15px;
        bottom: 15px;
      };
    }
  }

  .right-column {
    margin-left: 230px;
    width: calc(100% - 230px);
    background-color: white;


    #tabs {
      width: 100%;
      padding: {
        left: 15px;
        right: 15px;
      }

      #chart1 {
        height: 400px;
        width: 100%;
      }

      #chart2 {
        width: 100%;
        height: 400px;
      }
    }
  }
}


</style>
