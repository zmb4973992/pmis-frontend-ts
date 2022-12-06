<template>
  <div id="layout1">
    <div class="left-column">
      <a-select class="project-selector" v-model:value="project_ids"></a-select>
      <a-divider id="divider"/>
        <div class="tree">
          <a-tree v-if="treeData.length" :show-icon="true" :tree-data="treeData"
                  v-model:selectedKeys="selectedKeys" :default-expand-all="true">
            <template #title="{title,key,level}">
          <span class="title" >
            <span>{{ title }}</span>
            <span class="buttons" v-if="level !== 1">
              <a  @click.stop="create"><PlusOutlined class="button"/></a>
              <a @click.stop="edit"><EditOutlined class="button"/></a>
              <a @click.stop="delete1"><DeleteOutlined class="button"/></a>
          </span>
          </span>
            </template>
          </a-tree>
        </div>
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
import {onMounted, ref, watch} from "vue";

const project_ids = ref([])

let c = true
import {PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons-vue";
interface treeDataFormat {
  title: string
  key: number
  children?: treeDataFormat[]
}
let treeData = ref<treeDataFormat[]>([])
GetDisassemblyTree(21).then(res => {
  treeData.value = res.data
  c = true
})
const selectedKeys = ref([]);
const activeKey = ref('1')

watch(selectedKeys, () => {
  console.log(selectedKeys.value[0])
});

import * as echarts from 'echarts';
import {GetDisassemblyTree} from "@/api/disassembly";

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
    width: 260px;

    background-color: white;
    margin-right: 10px;
    padding: 4px 10px 8px 10px;

    .project-selector {
      width: 200px;
      margin: {
        top: 4px;
      }
    }

    .tree {
      max-height: 500px;
      overflow-x: auto;
    }

    .title {
      .buttons {
        display: none;

        .button {
          margin-left: 6px;
        }

      }
    }

    //鼠标移入节点时，显示相关操作
    .ant-tree-treenode:hover {
      .buttons {
        display: inline;
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
    margin-left: 270px;
    width: calc(100% - 270px);
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


::-webkit-scrollbar {
  /* 滚动条整体样式 */
  width: 6px;
  height: 10px;
  /* 宽高分别对应横竖滚动条的尺寸 */
  /*border-radius: 1px;*/
}

::-webkit-scrollbar-thumb {
  /* 滚动条里的小方块 */
  border-radius: 5px;
  background: #c9c9c9;
}

</style>
