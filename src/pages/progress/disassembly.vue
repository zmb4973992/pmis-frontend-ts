<template>
  <div class="layout1">
    <a-row type="flex">
      <a-col flex="280px" class="left-column">
        <a-card size="small" :bordered="false">
          <a-select class="project-selector" show-search placeholder="请选择项目"
                    :filter-option="projectFilterOption" v-model:value="projectID"
                    :options="projectOptions">
          </a-select>

          <!--这里的getPopupContainer是为了修改popover的样式-->
          <!--https://www.cnblogs.com/buluzombie/p/16463276.html-->
          <a-popover placement="right"
                     :getPopupContainer="triggerNode => triggerNode.parentNode">
            <a-button class="edit-button" type="primary">
              <EditOutlined/>
            </a-button>
            <template #content>
              <a @click="toBeCompleted">使用模板拆解项目</a>
              <a-divider style="margin: 5px auto"/>
              <a style="color: red" @click="toBeCompleted">清空拆解情况</a>
            </template>
          </a-popover>

          <a-divider style="margin-top: 14px;margin-bottom: 14px"/>


          <a-tree class="tree" v-if="treeData?.length" :tree-data="treeData"
                  v-model:selectedKeys="selectedKeys" :default-expand-all="true"
          >
            <template #title="{title,key,level}">
          <span class="title">
            <span>{{ title }}</span>
              <a @click.stop="showModalForCreatingDisassembly(key)">
                <PlusOutlined class="button"/>
              </a>
              <a v-if="level !== 1" @click.stop="showModalForUpdatingDisassembly(key)">
                <EditOutlined class="button"/>
              </a>
              <a v-if="level !== 1" @click.stop="showModalForDeletingDisassembly(key)">
                  <DeleteOutlined class="button"/>
              </a>
          </span>
            </template>
          </a-tree>
        </a-card>
      </a-col>

      <a-col flex="10px"></a-col>

      <a-col flex="auto" class="right-column">
        <a-card size="small">
          sdfsdf
          <a-row class="table-buttons-row">

            <div class="buttons-for-table-setting">
              <a-tooltip title="设置列" size="small">
                <a-button type="text" @click="toBeCompleted" size="small">
                  <template #icon>
                    <setting-outlined/>
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </a-row>

          <a-table :data-source="data.dataList" :columns="columns"
                   size="small" :pagination="false">
            <template #bodyCell="{column,record,index}">
              <template v-if="column.dataIndex === 'line_number'">
                {{ index + 1 }}
              </template>
              <template v-else-if="column.dataIndex === 'action'">
                <a>详情</a>
                <a-divider type="vertical"/>
                <a @click="showModalForUpdating(record.id)">修改</a>
                <a-divider type="vertical"/>
                <a @click="showModalForDeleting(record.id)">删除</a>
              </template>
            </template>
          </a-table>


          <!--分页器-->
          <a-pagination id="paginator" v-model:pageSize="queryForm.page_size"
                        :total="data.numberOfRecords" showSizeChanger
                        :pageSizeOptions="pageSizeOptions"
                        showQuickJumper @change="paginationChange"
                        :show-total="total=>`共${total}条记录`"/>

        </a-card>
      </a-col>
    </a-row>
  </div>

  <!--添加子项目的模态框-->
  <modal-for-creating-subitems ref="modalForCreatingSubitems"
                               @reloadDisassemblyTree1="reloadDisassemblyTree"/>
  <!--修改单项的模态框-->
  <modal-for-updating-subitem ref="modalForUpdatingItem"
                              @reloadDisassemblyTree="reloadDisassemblyTree"/>
  <!--删除单项的模态框-->
  <modal-for-deleting-item ref="modalForDeletingItem"
                           @reloadDisassemblyTree="reloadDisassemblyTree"/>


  <!--      <a-tabs id="tabs" v-model:activeKey="activeKey"-->
  <!--              @tabClick="change">-->
  <!--        <a-tab-pane key="1" tab="Tab 1" forceRender>-->
  <!--          <div id="chart1"></div>-->

  <!--        </a-tab-pane>-->
  <!--        <a-tab-pane key="2" tab="Tab 2" forceRender>-->
  <!--          <div id="chart2"></div>-->

  <!--        </a-tab-pane>-->
  <!--        <a-tab-pane key="3" tab="Tab 3">-->
  <!--          <div id="chart3"></div>-->
  <!--        </a-tab-pane>-->

  <!--        <a-tab-pane key="4" tab="Tab 4" force-render>-->
  <!--        </a-tab-pane>-->
  <!--      </a-tabs>-->
</template>

<script setup lang="ts">
let data = reactive({dataList: [], numberOfPages: 1, numberOfRecords: 1,})

//查询条件
const queryForm = reactive<iProjectGetList>({
  is_showed_by_role: false,
  department_id_in: [],
  name_include: "",
  department_name_include: "",
  page: 1,
  page_size: 12,
  order_by: "",
  desc: false,
})

let columns = ref([
  {
    title: '行号',
    dataIndex: 'line_number',
    className: 'line_number1',
    width: '500px',
    ellipsis:true,
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    className: 'name1',
    width: '200px',
    ellipsis:true,

  },
])

import ModalForUpdatingSubitem from "@/pages/progress/component/modal-for-updating-subitem.vue";

//用于创建子项的模态框
const modalForCreatingSubitems = ref()

function showModalForCreatingDisassembly(key: number) {
  modalForCreatingSubitems.value.showModal(key)
}

//用于修改选中项的模态框
const modalForUpdatingItem = ref()

function showModalForUpdatingDisassembly(key: number) {
  modalForUpdatingItem.value.showModal(key)
}

//用于删除选中项的模态框
const modalForDeletingItem = ref()

function showModalForDeletingDisassembly(key: number) {
  modalForDeletingItem.value.showModal(key)
}

import ModalForCreatingSubitems from "@/pages/progress/component/modal-for-creating-subitems.vue";

//项目选择框的过滤器（下拉框搜索）
import {message} from "ant-design-vue";
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons-vue";
import * as echarts from 'echarts';
import {disassemblyApi} from "@/api/disassembly";

import {iProjectGetList, projectApi} from "@/api/project";
import dayjs from 'dayjs'
import ModalForDeletingItem from "@/pages/progress/component/modal-for-deleting-item.vue";

let projectID = ref()
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
watch(projectID, () => {
  //项目id发生变动后，要清空treeData，否则a-tree组件就不会自动展开了
  treeData.value = []
  disassemblyApi.getTree(projectID.value).then(res => {
    treeData.value = res.data
  })
})

function toBeCompleted() {
  message.info('待完成')
}

//异步写法测试，可以和then交替使用
async function aa() {
  const res = await disassemblyApi.getTree({project_id: 52})
  treeData.value = res.data
}

aa()

const projectOptions = ref<{ value: number; label: string }[]>([])

interface treeDataFormat {
  title: string
  key: number
  children?: treeDataFormat[]
}

let treeData = ref<treeDataFormat[]>([])

const selectedKeys = ref([]);

watch(selectedKeys, () => {
  console.log(selectedKeys.value[0])
});

const activeKey = ref('1')


projectApi.getList({
  is_showed_by_role: true,
  page_size: 1000
}).then(res => {
  console.log(res);
  for (let item of res.data) {
    projectOptions.value.push({label: item.project_full_name, value: item.id})
  }
})

nextTick(() => console.log('next'))

function change(targetKey: string) {
  let a = Number(targetKey)
  if (a === 1) {
    setTimeout(() => {
      let chart1 = echarts.init(document.getElementById('chart1') as HTMLElement)
      chart1.resize()
    }, 1)
  } else if (a === 2) {
    setTimeout(() => {
      let chart2 = echarts.init(document.getElementById('chart2') as HTMLElement)
      chart2.resize()
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
        chart2.resize()
      })
    }, 1)
  }

}


onMounted(() => {
  //需要等节点挂载完毕后，才开始echarts的相关操作，否则会找不到节点
  //这里只处理tabs第一个图表，其他图表都在切换标签时进行处理
  // let chart1 = echarts.init(document.getElementById('chart1') as HTMLElement)
  // chart1.resize()
  // chart1.setOption({
  //   tooltip: {
  //     trigger: 'item'
  //   },
  //
  //   title: {
  //     text: '圆环图的例子',
  //     left: 'center',
  //     top: 'center'
  //   },
  //   legend: {
  //     top: '5%',
  //     left: 'center'
  //   },
  //   series: [
  //     {
  //       type: 'pie',
  //       itemStyle: {
  //         borderRadius: 10,
  //         borderColor: '#fff',
  //         borderWidth: 2
  //       },
  //       label: {
  //         show: false,
  //       },
  //       data: [
  //         {
  //           value: 1548,
  //           name: 'C'
  //         },
  //         {
  //           value: 335,
  //           name: 'A'
  //         },
  //         {
  //           value: 234,
  //           name: 'B'
  //         },
  //
  //       ],
  //       radius: ['40%', '70%']
  //     }
  //   ]
  // })
  // window.addEventListener('resize', () => chart1.resize())
})

function reloadDisassemblyTree() {
  disassemblyApi.getTree({project_id: 52}).then(res => {
    treeData.value = res.data
  })
}

</script>

<style lang="scss">
.layout1 {
  overflow-x: auto;

  .left-column {
    background-color: white;

    .project-selector {
      width: 215px;
    }

    .edit-button {
      margin: {
        left: 8px;
      }
      padding: {
        left: 7px;
        right: 7px;
      }
    }

    .tree {
      height: calc(100vh - 141px);
      overflow: auto;
    }

    .tree::-webkit-scrollbar {
      display: none;
    }

    .tree:hover::-webkit-scrollbar {
      display: block;
    }

    .title {
      .button {
        display: none;
        margin-left: 6px;
      }
    }

    //鼠标移入节点时，显示相关操作
    .ant-tree-treenode:hover {
      .button {
        display: inline;
      }
    }

  }

  .right-column {
    //这个宽度必须有！
    //由于right-column是grid模式，如果在没有宽度、且column设置了ellipsis=true的情况下，表格会另起一行
    //这里的宽度值任意填，不会影响布局，只是告诉table有宽度而已
    width: 100px !important;
  }
}

</style>
