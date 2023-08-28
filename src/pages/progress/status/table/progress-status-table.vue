<template>
  <div class="layout">
    <a-row type="=flex">
      <!--左侧内容区-->
      <a-col flex="280px" class="left-column">
        <a-card size="small" :bordered="false">
          <div class="label-and-selector">
            <span>项目名称：</span>
            <a-select class="project-selector" show-search placeholder="支持模糊搜索" allow-clear
                      :filter-option="projectFilterOption" v-model:value="queryCondition.projectID"
                      :options="projectOptions" style="width: 0"/>
          </div>

          <a-divider style="margin-top: 14px;margin-bottom: 14px"/>

          <a-tree v-if="treeData?.length" :tree-data="treeData"
                  v-model:selectedKeys="selectedDisassemblyIDs" default-expand-all/>
        </a-card>

      </a-col>

      <!--这是分割线-->
      <a-col flex="10px"/>

      <!--右侧内容区-->
      <a-col flex="auto" class="right-column">
        <!--查询区域-->
        <a-card size="small" :bordered="false" style="margin-bottom: 10px"
                :body-style="{padding:'0 10px 10px 10px'}">
          <a-form :model="queryCondition" ref="formRef">
            <a-row :gutter="10">
              <a-col>
                <a-form-item class="query-item" label="进度类型" name="type">
                  <a-select placeholder="进度类型"
                            v-model:value="queryCondition.type" :options="progressTypeOptions"
                            style="width:110px"/>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item class="query-item" label="数据来源" name="dataSource">
                  <a-select placeholder="数据来源" v-model:value="queryCondition.dataSource"
                            :options="dataSourceOptions" style="width:130px"/>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item class="query-item" label="日期" name="dateRange">
                  <a-range-picker v-model:value="queryCondition.dateRange" value-format="YYYY-MM-DD"/>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item class="query-item">
                  <a-button-group>
                    <a-button class="button" type="primary" @click="query">
                      <template #icon>
                        <SearchOutlined/>
                      </template>
                      查询
                    </a-button>
                    <a-button class="button" @click="resetQueryCondition">
                      <template #icon>
                        <RedoOutlined/>
                      </template>
                      重置
                    </a-button>
                  </a-button-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <a-card size="small" :bordered="false">
          <a-row class="table-buttons-row">
            <a-space>
              <template v-if="queryCondition.projectID">
                <a-button size="small" type="primary"
                          @click="showModalForCreatingPlannedProgress(queryCondition.disassemblyID)">
                  <template #icon>
                    <PlusOutlined/>
                  </template>
                  添加计划进度
                </a-button>

                <a-button size="small" type="primary"
                          @click="showModalForCreatingForecastedProgress(queryCondition.disassemblyID)">
                  <template #icon>
                    <PlusOutlined/>
                  </template>
                  添加预测进度
                </a-button>

                <a-button size="small" type="primary"
                          @click="showModalForCreatingActualProgress(queryCondition.disassemblyID)">
                  <template #icon>
                    <PlusOutlined/>
                  </template>
                  添加实际进度
                </a-button>

              </template>
              <template v-else>
                <a-tooltip>
                  <template #title>
                    先在左侧选择项目后，才能添加进度
                  </template>
                  <a-button size="small" disabled>
                    <template #icon>
                      <PlusOutlined/>
                    </template>
                    添加计划进度
                  </a-button>
                </a-tooltip>

                <a-tooltip>
                  <template #title>
                    先在左侧选择项目后，才能添加进度
                  </template>
                  <a-button size="small" disabled>
                    <template #icon>
                      <PlusOutlined/>
                    </template>
                    添加实际进度
                  </a-button>
                </a-tooltip>

                <a-tooltip>
                  <template #title>
                    先在左侧选择项目后，才能添加进度
                  </template>
                  <a-button size="small" type="primary" disabled>
                    <template #icon>
                      <PlusOutlined/>
                    </template>
                    添加预测进度
                  </a-button>
                </a-tooltip>
              </template>
            </a-space>
            <div class="buttons-for-table-setting">
              <a-tooltip title="设置列" size="small">
                <!--                <a-button type="text" @click="toBeCompleted" size="small">-->
                <!--                  <template #icon>-->
                <!--                    <setting-outlined style="font-size: 16px"/>-->
                <!--                  </template>-->
                <!--                </a-button>-->
              </a-tooltip>
            </div>
          </a-row>

          <a-table :data-source="tableData.list" :columns="columns"
                   size="small" :pagination="false" :scroll="{x:1000}"
                   @change="tableChange" :loading="loading">
            <template #bodyCell="{column,record,index}">
              <template v-if="column.dataIndex === 'line_number'">
                {{ index + 1 }}
              </template>
              <template v-else-if="column.dataIndex === 'action'">
                <template v-if="record?.data_source?.name === '系统计算'">
                  <a-tooltip>
                    <template #title>
                      <span>”系统计算“的数据无法修改</span>
                    </template>
                    <a-button type="link" disabled style="padding: 0">
                      修改
                    </a-button>
                  </a-tooltip>
                  <a-divider type="vertical"/>
                  <a-tooltip placement="topRight">
                    <template #title>
                      <span>”系统计算“的数据无法删除</span>
                    </template>
                    <a-button type="link" disabled style="padding: 0">
                      删除
                    </a-button>
                  </a-tooltip>
                </template>
                <template v-else>
                  <a-button type="link" style="padding: 0"
                            @click="showModalForUpdatingProgress(record.id)">
                    修改
                  </a-button>
                  <a-divider type="vertical"/>
                  <a-button type="link" style="padding: 0" danger
                            @click="showModalForDeletingProgress(record.id)">
                    删除
                  </a-button>
                </template>
              </template>
              <template v-else-if="column.dataIndex[0] === 'type' && column.dataIndex[1] === 'name' ">
                <template v-if="record.type.name === '计划进度'">
                  <span style="color:#1890ff">{{ record.type.name }}</span>
                </template>
                <template v-if="record.type.name === '实际进度'">
                  <span style="color:red">{{ record.type.name }}</span>
                </template>
                <template v-if="record.type.name === '预测进度'">
                  <span style="color:orange">{{ record.type.name }}</span>
                </template>
              </template>
            </template>
          </a-table>

          <!--分页器-->
          <a-pagination class="paginator" v-model:current="queryCondition.page"
                        v-model:pageSize="queryCondition.pageSize" show-less-items
                        :total="tableData.numberOfRecords" show-size-changer
                        :pageSizeOptions="pageSizeOptions" show-quick-jumper
                        @change="loadTableData"
                        :show-total="(total:any)=>`共${total.toLocaleString()}条记录`"/>
        </a-card>
      </a-col>
    </a-row>
  </div>

  <!--添加计划进度的模态框-->
  <modal-for-creating-progress
      ref="modalForCreatingPlannedProgress" @loadData="loadData"
      :projectID="queryCondition.projectID" :progressType="progressTypes.planned"/>

  <!--添加实际进度的模态框-->
  <modal-for-creating-progress
      ref="modalForCreatingActualProgress" @loadData="loadData"
      :projectID="queryCondition.projectID" :progress-type="progressTypes.actual"/>

  <!--添加预测进度的模态框-->
  <modal-for-creating-progress
      ref="modalForCreatingForecastedProgress" @loadData="loadData"
      :projectID="queryCondition.projectID" :progress-type="progressTypes.forecasted"/>

  <!--修改进度的模态框-->
  <modal-for-updating-progress
      ref="modalForUpdatingProgress" @loadData="loadData"/>
  <!--删除进度的模态框-->
  <modal-for-deleting-progress
      ref="modalForDeletingProgress" @loadData="loadData"/>
</template>

<script setup lang="ts">
import ModalForCreatingProgress from "@/pages/progress/status/table/component/modal-for-creating-progress.vue";
import ModalForUpdatingProgress from "@/pages/progress/status/table/component/modal-for-updating-progress.vue";
import ModalForDeletingProgress from "@/pages/progress/status/table/component/modal-for-deleting-progress.vue";
import {FormInstance, message, SelectProps} from "ant-design-vue";
import {reactive, ref, watch} from "vue";
import {PlusOutlined, SearchOutlined, RedoOutlined} from "@ant-design/icons-vue";
import {disassemblyApi} from "@/api/disassembly";
import {projectApi} from "@/api/project";
import {progressApi} from "@/api/progress";
import {dictionaryDetailApi} from "@/api/dictionary-detail";
import {pagingFormat} from "@/interfaces/paging-interface";
import {pageSizeOptions} from "@/constants/paging-constant";

//项目的选项
const projectOptions = ref<SelectProps['options']>([])

//项目id下拉框的过滤器
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

//加载项目下拉框的选项
async function loadProjectOptions() {
  try {
    let res = await projectApi.getList({page_size: 0})
    for (let item of res.data) {
      projectOptions.value?.push({label: item.name, value: item.id})
    }
  } catch (e: any) {
    console.log(e)
  }
}

//加载本地存储的数据
function loadLocalStorage() {
  const tempProjectID = Number(localStorage.getItem("project_id"))
  if (tempProjectID > 0) {
    queryCondition.projectID = tempProjectID
  }
}

//请用户选择项目id的提示
function tipsForSelectingProjectID() {
  if (!queryCondition.projectID) {
    message.info('您没有选择项目，请先在左侧选择项目', 5)
  }
}

//树形图数据的格式
interface treeDataFormat {
  title: string
  key: number
  level: number
  children?: treeDataFormat[]
}

//树形图数据
let treeData = ref<treeDataFormat[]>([])

//加载树形图数据
async function loadTreeData() {
  try {
    //要清空treeData、然后再重新加载，否则a-tree组件就不会自动展开
    treeData.value = []
    if (queryCondition.projectID) {
      let res = await disassemblyApi.getTree({project_id: queryCondition.projectID})
      if (res?.code === 0) {
        for (let index in res.data) {
          treeData.value.push(switchToTreeData(res.data[index]))
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

//从后端获取的、原始树形图数据的格式
interface rawTreeDataFormat {
  name: string
  id: number
  level: number
  children?: rawTreeDataFormat[]
}

//后端返回的结果为：[{name:xxx,id:xxx,children:xxx}]，需要修改字段名称
function switchToTreeData(obj: rawTreeDataFormat): treeDataFormat {
  return {
    title: obj.name,
    key: obj.id,
    level: obj.level,
    children: obj.children?.map(child => switchToTreeData(child)) || undefined
  }
}

//用于树形图的disassemblyIDs
const selectedDisassemblyIDs = ref<number[]>([])

//监测disassemblyIDs，将值传给查询条件
watch(selectedDisassemblyIDs, () => {
  queryCondition.disassemblyID = selectedDisassemblyIDs.value[0]
})

//进度类型的选项
const progressTypeOptions = ref<SelectProps['options']>([])
let progressTypes = reactive({
  planned: 0,
  actual: 0,
  forecasted: 0,
})

//加载进度类型的选项
async function loadProgressTypeOptions() {
  try {
    let res = await dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: '进度类型'})
    for (let item of res.data) {
      if (item.name === "计划进度") {
        progressTypes.planned = item.id
      } else if (item.name === "实际进度") {
        progressTypes.actual = item.id
      } else if (item.name === "预测进度") {
        progressTypes.forecasted = item.id
      }
      progressTypeOptions.value?.push({value: item.id, label: item.name})
    }
  } catch (err) {
    console.log(err);
  }
}

//数据来源的选项
const dataSourceOptions = ref<SelectProps['options']>([])

//加载数据来源的选项
async function loadDataSourceOptions() {
  try {
    let res = await dictionaryDetailApi.getList({page_size: 0, dictionary_type_name: '进度的数据来源'})
    for (let item of res.data) {
      dataSourceOptions.value?.push({value: item.id, label: item.name})
    }
  } catch (err) {
    console.log(err);
  }
}

//加载所有的选项
function loadOptions() {
  loadProjectOptions()
      .then(loadLocalStorage)
      .then(tipsForSelectingProjectID)
  loadProgressTypeOptions()
  loadDataSourceOptions()
}

loadOptions()

//查询条件的格式
interface queryConditionFormat extends pagingFormat {
  projectID?: number
  disassemblyID?: number
  type?: number
  dataSource?: number
  dateRange?: [string, string]
}

//查询条件
const queryCondition = reactive<queryConditionFormat>({
  orderBy: "date",
  desc: true,
  page: 1,
  pageSize: 12,
})

//监测查询条件中projectID的变化
watch(() => queryCondition.projectID, () => {
  localStorage.setItem("project_id", String(queryCondition.projectID))
  tipsForSelectingProjectID()
  loadTreeData().then(() => {
    selectedDisassemblyIDs.value = []
    selectedDisassemblyIDs.value.push(treeData.value[0]?.key)
  })
})

//监测查询条件中disassemblyID的变化
watch(() => queryCondition.disassemblyID, () => {
  //disassemblyID变化时视为重新查询，必须将页码调整为1
  queryCondition.page = 1
  loadTableData()
})

//声明form表单，便于使用form相关的函数。这里的变量名要跟form表单的ref保持一致
const formRef = ref<FormInstance>();

//查询按钮
function query() {
  //所有查询都从第一页开始
  queryCondition.page = 1
  loadTableData()
}

//重置查询条件
function resetQueryCondition() {
  //使用resetFields时，要确保相关的a-form-item都添加了name属性
  //同时name的值要等于reactive数据的字段名，这样form的函数才能找到相关字段
  formRef.value?.resetFields()
  queryCondition.page = 1
  queryCondition.pageSize = 12
  loadTableData()
}

//表格数据
let tableData = reactive({list: [], numberOfPages: 1, numberOfRecords: 0,})

//表格的状态，是否为加载中
const loading = ref(false)

//表格的列
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
    title: '日期',
    dataIndex: 'date',
    className: 'date',
    width: '10%',
    ellipsis: true,
    align: 'center',
    sorter: true,
    defaultSortOrder: 'descend',
  },
  {
    title: '类型',
    dataIndex: ['type', 'name'],
    className: 'type',
    width: '120px',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '进度值',
    dataIndex: 'value',
    className: 'value',
    width: '100px',
    align: 'center',
  },
  {
    title: '数据来源',
    dataIndex: ['data_source', 'name'],
    className: 'data_source',
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    className: 'remarks',
    align: 'center',
  },
  {
    title: '操作',
    className: 'action',
    dataIndex: 'action',
    width: '110px',
    ellipsis: true,
    align: 'center',
    fixed: 'right',
  },
])

//表格需要排序时的回调函数
function tableChange(pagination: any, filter: any, sorter: any) {
  try {
    //将页码调回到第一页，一边显示，一边查询
    queryCondition.page = 1
    queryCondition.orderBy = sorter.field
    queryCondition.desc = sorter.order === "descend"
  } catch (err) {
    queryCondition.orderBy = undefined
    queryCondition.desc = undefined
  } finally {
    loadTableData()
  }
}

//加载表格数据
async function loadTableData() {
  try {
    //如果选择了拆解id
    if (queryCondition.disassemblyID) {
      loading.value = true
      let res = await progressApi.getList({
        disassembly_id: queryCondition.disassemblyID,
        type: queryCondition.type,
        date_gte: queryCondition.dateRange ? queryCondition.dateRange[0] : undefined,
        date_lte: queryCondition.dateRange ? queryCondition.dateRange[1] : undefined,
        data_source: queryCondition.dataSource,
        page: queryCondition.page,
        page_size: queryCondition.pageSize,
        order_by: queryCondition.orderBy,
        desc: queryCondition.desc,
      })
      if (res?.code === 0) {
        for (let item of res.data) {
          item.value = (item.value * 100).toFixed(1) + '%'
        }
        tableData.list = res?.data
        tableData.numberOfPages = res?.paging?.number_of_pages
        tableData.numberOfRecords = res?.paging?.number_of_records
      } else {
        tableData.list = []
        tableData.numberOfPages = 1
        tableData.numberOfRecords = 0
      }
    } else {
      tableData.list = []
      tableData.numberOfPages = 1
      tableData.numberOfRecords = 0
    }
  } catch (err) {
    tableData.list = []
    tableData.numberOfPages = 1
    tableData.numberOfRecords = 0
    console.log(err)
  } finally {
    loading.value = false
  }
}

//加载所有数据
function loadData() {
  loadTreeData().then(loadTableData)
}

//用于创建计划进度的模态框
const modalForCreatingPlannedProgress = ref()

//打开用于创建计划进度的模态框
function showModalForCreatingPlannedProgress(disassemblyID?: number) {
  modalForCreatingPlannedProgress.value.showModal(disassemblyID)
}

//用于创建实际进度的模态框
const modalForCreatingActualProgress = ref()

//打开用于创建实际进度的模态框
function showModalForCreatingActualProgress(disassemblyID?: number) {
  modalForCreatingActualProgress.value.showModal(disassemblyID)
}

//用于创建预测进度的模态框
const modalForCreatingForecastedProgress = ref()

//打开用于创建预测进度的模态框
function showModalForCreatingForecastedProgress(disassemblyID?: number) {
  modalForCreatingForecastedProgress.value.showModal(disassemblyID)
}

//用于修改进度的模态框
const modalForUpdatingProgress = ref()

//打开用于修改进度的模态框
function showModalForUpdatingProgress(disassemblyID: number) {
  modalForUpdatingProgress.value.showModal(disassemblyID)
}

//用于删除选进度的模态框
const modalForDeletingProgress = ref()

//打开用于删除选进度的模态框
function showModalForDeletingProgress(disassemblyID: number) {
  modalForDeletingProgress.value.showModal(disassemblyID)
}

function toBeCompleted() {
  message.info('待完成')
}
</script>

<style scoped lang="scss">
.layout {
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

  .right-column {
    //这个宽度必须有！
    //由于right-column是grid模式，如果在没有宽度、且column设置了ellipsis=true的情况下，表格会另起一行
    //这里的宽度值任意填，不会影响布局，只是告诉table有宽度而已
    width: 10px;

    //查询区域每一项的样式
    .query-item {
      margin: {
        top: 10px;
        bottom: 0;
      }
    }

    //表格上方按钮行的样式
    .table-buttons-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
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

//分页器的样式
.paginator {
  margin-top: 10px;
  text-align: right;

  //每页记录条数的样式
  :deep(.ant-select-item-option) {
    text-align: center;
  }
}

.label-and-selector {
  display: flex;
  align-items: center;

  .project-selector {
    flex: 1;
  }
}

//表格的表头样式
:deep(.ant-table-thead) {
  > tr > th {
    text-align: center !important;
  }
}

:deep(.ant-table) {
  //滚动条整体样式
  ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  //调整表格行高
  .ant-table-tbody > tr > td {
    padding: 4px;
  }

  //滚动条里的滑块
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #c9c9c9;
  }

  //滚动条的轨道
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
}

//日期选择器的宽度
.ant-picker-range {
  width: 230px;
}

</style>

