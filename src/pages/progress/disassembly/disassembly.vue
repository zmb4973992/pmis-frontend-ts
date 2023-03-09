<template>
  <div class="layout1">
    <a-row type="flex">
      <!--左侧内容区-->
      <a-col flex="280px" class="left-column">
        <a-card size="small" :bordered="false">
          <div class="label-and-selector" style="display: flex">
            <span>项目：</span>
            <a-select class="project-selector" show-search placeholder="请选择项目"
                      :filter-option="projectFilterOption" v-model:value="projectID"
                      :options="projectOptions">
            </a-select>
          </div>

          <a-divider style="margin-top: 14px;margin-bottom: 14px"/>

          <a-tree class="tree1" v-if="treeData?.length" :tree-data="treeData"
                  v-model:selectedKeys="selectedDisassemblyIDs" :default-expand-all="true"
          >
<!--            <template #title="{title,key,level}">-->
<!--          <span class="title">-->
<!--            <span>{{ title }}</span>-->
<!--              <a @click.stop="showModalForCreatingDisassembly">-->
<!--                <PlusOutlined class="button"/>-->
<!--              </a>-->
<!--              <a v-if="level !== 1" @click.stop="showModalForUpdatingDisassembly">-->
<!--                <EditOutlined class="button"/>-->
<!--              </a>-->
<!--              <a v-if="level !== 1" @click.stop="showModalForDeletingDisassembly(key)">-->
<!--                  <DeleteOutlined class="button"/>-->
<!--              </a>-->
<!--          </span>-->
<!--            </template>-->
          </a-tree>
        </a-card>
      </a-col>

      <!--这是分割线gutter-->
      <a-col flex="10px"></a-col>

      <!--右侧内容区-->
      <a-col flex="auto" class="right-column">
        <a-card size="small">
          <div class="table-buttons-row">
            <a-space>
              子分类数据：
              <a-button v-if="projectID" size="small" type="primary"
                        @click="showModalForCreatingDisassembly(selectedDisassemblyIDs[0])">
                <template #icon>
                  <PlusOutlined/>
                </template>
                添加
              </a-button>

              <a-button v-else size="small" type="primary" disabled
                        @click="showModalForCreatingDisassembly(selectedDisassemblyIDs[0])">
                <template #icon>
                  <PlusOutlined/>
                </template>
                添加
              </a-button>
              <!--              <a-button v-else size="small" type="primary" disabled>-->
              <!--                <template #icon>-->
              <!--                  <PlusOutlined/>-->
              <!--                </template>-->
              <!--                添加-->
              <!--              </a-button>-->
            </a-space>
            <div class="buttons-for-table-setting">
              <a-tooltip title="设置列" size="small">
                <a-button type="text" @click="toBeCompleted" size="small">
                  <template #icon>
                    <setting-outlined style="font-size: 16px"/>
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </div>

          <a-table :data-source="tableData.dataList" :columns="columns"
                   size="small" :pagination="false">
            <template #bodyCell="{column,record,index}">
              <template v-if="column.dataIndex === 'line_number'">
                {{ index + 1 }}
              </template>
              <template v-else-if="column.dataIndex === 'action'">
                <a @click="showModalForUpdatingDisassembly(record.id)">修改</a>
                <a-divider type="vertical"/>
                <a @click="showModalForDeletingDisassembly(record.id)" style="color: red">删除</a>
              </template>
            </template>
          </a-table>

          <!--分页器-->
          <a-pagination id="paginator" v-model:pageSize="queryCondition.page_size"
                        :total="tableData.numberOfRecords" showSizeChanger
                        :pageSizeOptions="pageSizeOptions"
                        showQuickJumper @change="paginationChange"
                        :show-total="total=>`共${total}条记录`"/>

        </a-card>
      </a-col>
    </a-row>
  </div>

  <!--添加子项目的模态框-->
  <modal-for-creating-subitems
      ref="modalForCreatingSubitems" @loadData="loadData" :projectID="projectID"
      :disassemblyID="selectedDisassemblyIDs[0]"/>
  <!--修改单项的模态框-->
  <modal-for-updating-subitem
      ref="modalForUpdatingItem" @loadData="loadData" :projectID="projectID"/>
  <!--删除单项的模态框-->
  <modal-for-deleting-item
      ref="modalForDeletingItem" @loadData="loadData"/>


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
import ModalForCreatingSubitems from "@/pages/progress/disassembly/component/modal-for-creating-subitems.vue";
import ModalForUpdatingSubitem from "@/pages/progress/disassembly/component/modal-for-updating-subitem.vue";
import ModalForDeletingItem from "@/pages/progress/disassembly/component/modal-for-deleting-item.vue";
import {message} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import { PlusOutlined} from "@ant-design/icons-vue";
import * as echarts from 'echarts';
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";

let tableData = reactive({dataList: [], numberOfPages: 1, numberOfRecords: 1,})

let columns = ref([
  {
    title: '行号',
    dataIndex: 'line_number',
    className: 'line_number',
    width: '60px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    className: 'name',
    width: '40%',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '权重',
    dataIndex: 'weight',
    className: 'weight',
    width: '30%',
    align: 'center',
  },
  {
    title: '操作',
    className: 'action',
    dataIndex: 'action',
    width: '150px',
    ellipsis: true,
    align: 'center',
  },
])

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

//项目选择框的过滤器
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

let projectID = ref()
watch(projectID, () => {
  loadTreeData()
  selectedDisassemblyIDs.value = []
})

function toBeCompleted() {
  message.info('待完成')
}

const projectOptions = ref<{ value: number; label: string }[]>([])

//树形图相关的数据
interface treeDataFormat {
  title: string
  key: number
  level: number
  children: treeDataFormat[] | null
}

let treeData = ref<treeDataFormat[]>([])

async function loadTreeData() {
  if (projectID.value) {
    //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
    treeData.value = []
    const res = await disassemblyApi.getTree({project_id: projectID.value})
    if (res.data) {
      for (let index in res.data) {
        treeData.value.push(switchToTreeData(res.data[index]))
      }
    }
  } else {
    treeData.value = []
  }
}

interface rawTreeDataFormat {
  name: string
  id: number
  level: number
  children?: rawTreeDataFormat[] | null
}

//后端返回的结果为：[{name:xxx,id:xxx,children:xxx}]，需要修改字段名称
function switchToTreeData(obj: rawTreeDataFormat): treeDataFormat {
  return {
    title: obj.name,
    key: obj.id,
    level: obj.level,
    children: obj.children?.map(child => switchToTreeData(child)) || null
  }
}


const selectedDisassemblyIDs = ref([]);
watch(selectedDisassemblyIDs, () => loadTableData());

async function loadTableData() {
  //如果选择了拆解id
  if (selectedDisassemblyIDs.value.length > 0) {
    let res = await disassemblyApi.getList({
      superior_id: selectedDisassemblyIDs.value[0],
      page_size: queryCondition.page_size,
      page: queryCondition.page,
    })
    if (res && res.data) {
      for (let item of res.data) {
        item.weight = (item.weight * 100).toFixed(1) + '%'
      }
      tableData.dataList = res?.data
      tableData.numberOfPages = res?.paging?.number_of_pages
      tableData.numberOfRecords = res?.paging?.number_of_records
    } else {
      tableData.dataList = []
    }
  } else {
    tableData.dataList = []
  }
}

function loadData() {
  loadTreeData()
  loadTableData()
}

//获取项目下拉框的选项
async function loadProjectOptions() {
  let res = await projectApi.getList({page_size: 0})
  for (let item of res.data) {
    projectOptions.value.push({label: item.name, value: item.id})
  }
}

loadProjectOptions()

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

//查询条件
const queryCondition = reactive({
  page: 1,
  page_size: 12,
  order_by: "",
  desc: false,
})

//分页器选项
const pageSizeOptions = ['12', '20', '25', '30']

//页码变化时的回调函数
const paginationChange = (page: number, pageSize: number) => {
  queryCondition.page = page
  queryCondition.page_size = pageSize
  console.log(page, pageSize)
  loadTableData()
}

</script>

<style scoped lang="scss">
.layout1 {
  overflow-x: auto;

  .left-column {
    background-color: white;
    height: calc(100vh - 55px);

    :deep(.ant-tree) {
      height: calc(100vh - 141px);
      width: 255px;
      overflow: auto;
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
}

.right-column {
  //这个宽度必须有！
  //由于right-column是grid模式，如果在没有宽度、且column设置了ellipsis=true的情况下，表格会另起一行
  //这里的宽度值任意填，不会影响布局，只是告诉table有宽度而已
  width: 10px;

  .table-buttons-row {
    height: 35px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}


//鼠标移入节点时，显示相关操作
:deep(.ant-tree) {
  .ant-tree-treenode:hover {
    .button {
      display: inline;
    }
  }

  .ant-tree-indent-unit {
    width: 1em;
  }

  .ant-tree-switcher {
    width: 10px;
  }

  .ant-tree-title {
    word-break: break-all;
  }
}


.title {
  .button {
    display: none;
    margin-left: 6px;
  }
}

#paginator {
  margin-top: 10px;
  text-align: right;

  .ant-select-item-option {
    text-align: center;
  }
}

.label-and-selector {
  align-items: center;

  .project-selector {
    flex: 1;
  }
}

</style>

