<template>
  <div class="layout1">
    <div class="left-column">
      <a-select class="project-selector" v-model:value="ks" :options="projectOptions"></a-select>
      <a-divider id="divider"/>
      <div class="tree-wrapper-outside">
        <div class="tree-wrapper-inside">
          <a-tree v-if="treeData.length" :show-icon="true" :tree-data="treeData"
                  v-model:selectedKeys="selectedKeys" :default-expand-all="true">
            <template #title="{title,key,level}">
          <span class="title">
            <span>{{ title }}</span>
            <span class="buttons" v-if="level !== 1">
              <a @click.stop="create"><PlusOutlined class="button"/></a>
              <a @click.stop="edit"><EditOutlined class="button"/></a>
              <a @click.stop="delete1"><DeleteOutlined class="button"/></a>
          </span>
          </span>
            </template>
          </a-tree>
        </div>
      </div>
    </div>


    <div class="right-column">
      <a-tabs id="tabs" v-model:activeKey="activeKey" @change="change(activeKey)">
        <a-tab-pane key="1" tab="Tab 1">
          <div id="chart1"></div>

        </a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render>
          <div id="chart2"></div>

        </a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">
          <div id="chart3"></div>
        </a-tab-pane>

        <a-tab-pane key="4" tab="Tab 4">
          Content of Tab Pane 4
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>


</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

const projectOptions = ref<{value: number; label: string}[]>([])

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

import {GetProjectList} from "@/api/project";

GetProjectList({verify_role: true, page_size: 100}).then(res => {
  for (let item of res.data) {
    projectOptions.value.push({label:item.project_full_name,value:item.id})
  }
  console.log(projectOptions.value)
})

const change = (key: any) => {
  console.log(key)
  setTimeout(() => {
    let chart2 = echarts.init(document.getElementById('chart2') as HTMLElement)
    chart2.resize()
  }, 10)
}

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
.layout1 {
  overflow-x: auto;

  .left-column {
    float: left;
    width: 260px;

    background-color: white;
    margin-right: 10px;
    padding: 4px 10px 8px 10px;

    .project-selector {
      width: 100%;
      margin: {
        top: 4px;
      }
    }

    .tree-wrapper-outside {
      height: calc(100vh - 117px);

      .tree-wrapper-inside {
        overflow: auto;
        max-height: calc(100vh - 117px);
      }

      ::-webkit-scrollbar {
        display: none;
      }

      &:hover {
        ::-webkit-scrollbar {
          display: block;
        }
      }
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
        top: 10px;
        bottom: 10px;
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
        width: 100%;
        height: 400px;
      }

      #chart2 {
        width: 100%;
        height: 400px;
      }
    }
  }
}


</style>
