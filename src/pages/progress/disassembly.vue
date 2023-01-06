<template>
  <div class="layout1">
    <div class="left-column">
      <a-select class="project-selector" show-search placeholder="请选择项目"
                :filter-option="projectFilterOption" v-model:value="project_id"
                :options="projectOptions"></a-select>

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


      <a-divider id="divider"/>
      <div class="tree-wrapper-outside">
        <div class="tree-wrapper-inside">
          <a-tree v-if="treeData?.length" :tree-data="treeData"
                  v-model:selectedKeys="selectedKeys" :default-expand-all="true">
            <template #title="{title,key,level}">
          <span class="title">
            <span>{{ title }}</span>
              <a @click.stop="openModalForCreatingDisassembly(key)">
                <PlusOutlined class="button"/>
              </a>
              <a v-if="level !== 1" @click.stop="openModalForEditingDisassembly(key)">
                <EditOutlined class="button"/>
              </a>
              <a v-if="level !== 1" @click.stop="openModalForDeletingDisassembly(key)">
                  <DeleteOutlined class="button"/>
              </a>
          </span>
            </template>
          </a-tree>
        </div>
      </div>
    </div>

    <!--添加子项目的模态框-->
    <a-modal v-model:visible="visibilityOfModalForCreatingDisassembly"
             :after-close="resetFormOfCreatingDisassembly" title="添加子项"
             @ok="submitFormDataForCreatingDisassembly"
             style="width: 400px;">

      <a-form ref="formForCreateDisassembly" :model="disassemblyData">
        <div style="margin-bottom: 5px">
          <span style="margin-right: 127px">名称：</span>
          <span>权重：</span>
        </div>
        <a-space v-for="(disassemblyItem, index) in disassemblyData.disassemblySubitems"
                 style="display: flex; margin-bottom: 0;" align="baseline">
          <a-form-item :name="['disassemblySubitems', index, 'name']" style="width: 160px"
                       :rules="{required: true, message: '请填写名称'}">
            <a-input v-model:value="disassemblyItem.name"/>
          </a-form-item>
          <a-form-item :name="['disassemblySubitems', index, 'weight']"
                       :rules="{required: true, message: '请填写权重'}">
            <a-input-number v-model:value="disassemblyItem.weight" :controls="false"
                            id="a1" addon-after="%" :min="0" :max="100" :precision="1"/>
          </a-form-item>

          <MinusCircleOutlined v-if="disassemblyData.disassemblySubitems.length > 1"
                               @click="removeItem(disassemblyItem)"/>
        </a-space>
        <a-form-item>
          <a-button @click="addItem">
            <PlusOutlined/>
            添加一行
          </a-button>
        </a-form-item>

        {{ disassemblyData.disassemblySubitems }}
      </a-form>

    </a-modal>

    <!--修改单项的模态框-->
    <a-modal v-model:visible="visibilityOfModalForUpdatingDisassembly"
             :after-close="resetFormOfUpdatingDisassembly" title="修改拆解项"
             @ok="submitFormForUpdatingDisassembly" style="width: 400px">
      <a-form ref="formForUpdatingDisassembly" :model="disassemblyData.disassemblyItem">
        <a-form-item label="名称：" name="name"
                     :rules="{required: true, message: '请填写名称'}">
          <a-input v-model:value="disassemblyData.disassemblyItem.name"></a-input>
        </a-form-item>
        <a-form-item label="权重：" name="weight"
                     :rules="{required: true, message: '请填写权重'}">
          <a-input-number id="a2" v-model:value="disassemblyData.disassemblyItem.weight"
                          :controls="false" addon-after="%" :min="0" :max="100"
                          :precision="1">
          </a-input-number>
        </a-form-item>
        {{ disassemblyData.disassemblyItem }}
      </a-form>
    </a-modal>

    <!--删除单项的模态框-->
    <a-modal v-model:visible="visibilityOfModalForDeletingDisassembly"
             title="删除" @ok="submitFormForDeletingDisassembly" style="width: 300px">
      <div>确定要删除“{{ disassemblyData.disassemblyItem.name }}”吗？</div>
      <div>该分类和它的子分类都会被删除！</div>
    </a-modal>


    <div class="right-column">
      <a-tabs id="tabs" v-model:activeKey="activeKey"
      @tab-click="change()">
        <a-tab-pane key="1" tab="Tab 1">
          <div id="chart1"></div>

        </a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2">
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
//项目选择框的过滤器（下拉框搜索）
import {FormInstance, message} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import * as echarts from 'echarts';
import {
  CreateDisassemblyInBatches, DeleteDisassemblyWithSubitems,
  GetDisassembly,
  GetDisassemblyTree,
  IDisassembly,
  UpdateDisassembly
} from "@/api/disassembly";

import {GetProjectList} from "@/api/project";

let project_id = ref()
const projectFilterOption = (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
watch(project_id, () => {
  //项目id发生变动后，要清空treeData，否则a-tree组件就不会自动展开了
  treeData.value = []
  GetDisassemblyTree(project_id.value).then(res => {
    treeData.value = res.data
  })
})

function toBeCompleted() {
  message.info('待完成')
}

GetDisassemblyTree(52).then(res => {
  treeData.value = res.data
})

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


GetProjectList({verify_role: true, page_size: 100}).then(res => {
  for (let item of res.data) {
    projectOptions.value.push({label: item.project_full_name, value: item.id})
  }
  console.log(projectOptions.value)
})

const change = () => {
  console.log(activeKey.value)
  setTimeout(() => {
    let chart2 = echarts.init(document.getElementById('chart2') as HTMLElement)
    // chart2.resize()
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
  }, 1)
}

const visibilityOfModalForCreatingDisassembly = ref(false)
const visibilityOfModalForUpdatingDisassembly = ref(false)
const visibilityOfModalForDeletingDisassembly = ref(false)

onMounted(() => {
  let chart1 = echarts.init(document.getElementById('chart1') as HTMLElement)
  // let chart2 = echarts.init(document.getElementById('chart2') as HTMLElement)
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
  // chart2.setOption({
  //   tooltip: {
  //     trigger: 'axis',
  //   },
  //   legend: {
  //     show: true,
  //     data: ['boys', 'girls'],
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       name: 'boys',
  //       data: [820, 932, 901, 934, 1290, 1330, 1320],
  //       type: 'line',
  //       smooth: true
  //     },
  //     {
  //       name: 'girls',
  //       data: [480, 932, 401, 534, 1190, 1530, 1520],
  //       type: 'line',
  //       smooth: true
  //     },
  //   ],
  //   dataZoom: [
  //     {
  //       type: 'slider',
  //     },
  //     {
  //       type: 'inside',
  //     }
  //   ],
  //
  // })
  window.addEventListener('resize', () => {
    chart1.resize()
    // chart2.resize()
  })
})

function openModalForCreatingDisassembly(disassemblyID: number) {
  GetDisassembly(disassemblyID).then(res => {
    disassemblyData.disassemblyItem.disassembly_id = res.data.id
    disassemblyData.disassemblyItem.level = res.data.level
    disassemblyData.disassemblyItem.name = res.data.name
    disassemblyData.disassemblyItem.project_id = res.data.project_id
    disassemblyData.disassemblyItem.superior_id = res.data.superior_id
    disassemblyData.disassemblyItem.weight = res.data.weight
    if (disassemblyData.disassemblyItem.level > 0 && disassemblyData.disassemblyItem.level < 5) {
      visibilityOfModalForCreatingDisassembly.value = true
      disassemblyData.disassemblySubitems = [{
        name: '',
        project_id: 0,
        superior_id: 0,
        level: 0,
        disassembly_id: 0,
      }]
    } else {
      message.error('系统最高支持拆分到5层，当前已经是第5层，无法继续拆分了', 5)
    }
  })
}

function openModalForEditingDisassembly(disassemblyID: number) {
  // console.log('key:', key, '，触发了edit')
  visibilityOfModalForUpdatingDisassembly.value = true
  disassemblyData.disassemblyItem.disassembly_id = disassemblyID
  GetDisassembly(disassemblyID).then(
      res => {
        if (res.data) {
          disassemblyData.disassemblyItem.name = res.data.name
          disassemblyData.disassemblyItem.weight = res.data.weight * 100
          disassemblyData.disassemblyItem.project_id = res.data.project_id
          disassemblyData.disassemblyItem.level = res.data.level
          disassemblyData.disassemblyItem.superior_id = res.data.superior_id
        }
      }
  )
}

function openModalForDeletingDisassembly(disassemblyID: number) {
  visibilityOfModalForDeletingDisassembly.value = true
  disassemblyData.disassemblyItem.disassembly_id = disassemblyID
  GetDisassembly(disassemblyID).then(
      res => {
        if (res.data) {
          disassemblyData.disassemblyItem.name = res.data.name
          disassemblyData.disassemblyItem.weight = res.data.weight * 100
          disassemblyData.disassemblyItem.project_id = res.data.project_id
          disassemblyData.disassemblyItem.level = res.data.level
          disassemblyData.disassemblyItem.superior_id = res.data.superior_id
        }
      }
  )
}

// const deleteDisassembly = (key: number) => console.log('key:', key, '，触发了delete1')

interface disassemblyItem {
  disassembly_id: number
  name: string
  weight?: number
  project_id: number
  level: number
  superior_id: number
}

const formForCreateDisassembly = ref<FormInstance>()

//disassemblyItem为当前选中项，用来删改查；disassemblySubitems为当前选中项的子项，用来批量新增
const disassemblyData = reactive<{
  disassemblyItem: disassemblyItem,
  disassemblySubitems: disassemblyItem[],
}>({
  disassemblyItem: {
    disassembly_id: 0,
    name: '',
    project_id: 0,
    level: 0,
    superior_id: 0,
  },
  disassemblySubitems: [],
})

const formForUpdatingDisassembly = ref<FormInstance>()

const removeItem = (item: disassemblyItem) => {
  let index = disassemblyData.disassemblySubitems.indexOf(item);
  if (index !== -1) {
    disassemblyData.disassemblySubitems.splice(index, 1);
  }
};
const addItem = () => {
  disassemblyData.disassemblySubitems.push({
    name: '',
    project_id: 0,
    level: 0,
    superior_id: 0,
    disassembly_id: 0,
  });
};

function resetFormOfCreatingDisassembly() {
  formForCreateDisassembly.value!.clearValidate();
}

function resetFormOfUpdatingDisassembly() {
  formForUpdatingDisassembly.value!.clearValidate();
}

function submitFormDataForCreatingDisassembly() {
  formForCreateDisassembly.value!.validateFields().then(() => {
        let params: IDisassembly[] = []
        for (let item of disassemblyData.disassemblySubitems) {
          params.push({
            name: item.name,
            project_id: disassemblyData.disassemblyItem.project_id,
            weight: item.weight! / 100,
            level: disassemblyData.disassemblyItem.level + 1,
            superior_id: disassemblyData.disassemblyItem.disassembly_id,
          })
        }
        return CreateDisassemblyInBatches(params)
      },
  ).then(() => {
    message.success('添加成功')
    visibilityOfModalForCreatingDisassembly.value = false
    GetDisassemblyTree(52).then(res => {
      treeData.value = res.data
    })
  })
}

function submitFormForUpdatingDisassembly() {
  formForUpdatingDisassembly.value!.validateFields().then(
      () => {
        UpdateDisassembly(disassemblyData.disassemblyItem.disassembly_id, {
          level: disassemblyData.disassemblyItem.level,
          name: disassemblyData.disassemblyItem.name,
          project_id: disassemblyData.disassemblyItem.project_id,
          superior_id: disassemblyData.disassemblyItem.superior_id,
          weight: disassemblyData.disassemblyItem.weight as number / 100
        }).then(() => {
          message.success('修改成功')
          visibilityOfModalForUpdatingDisassembly.value = false
          GetDisassemblyTree(52).then(res => {
            treeData.value = res.data
          })
        });
      }
  )
}

function submitFormForDeletingDisassembly() {
  DeleteDisassemblyWithSubitems(disassemblyData.disassemblyItem.disassembly_id).then(
      () => {
        message.success('删除成功', 2)
        visibilityOfModalForDeletingDisassembly.value = false
        GetDisassemblyTree(52).then(res => {
          treeData.value = res.data
        })
      }
  )
}

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
      width: 205px;
      margin: {
        top: 4px;
        bottom: 7px;
        right: 5px;
      }
    }

    .edit-button {
      padding: {
        left: 7px;
        right: 7px;
      }
    }

    .tree-wrapper-outside {
      height: calc(100vh - 125px);

      .tree-wrapper-inside {
        overflow: auto;
        max-height: calc(100vh - 125px);
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

:deep(.ant-popover-inner-content) {
  padding: 5px 10px;
  text-align: center;
}

//input组件添加addon-before/addon-after属性后会发生错位，这里进行调整
:deep(.ant-input-number-group-wrapper) {
  margin-top: -5px;
  margin-bottom: -5px;
}

//调整数字输入框的对齐方式
:deep(#a1.ant-input-number-input) {
  text-align: right;
  width: 55px;
}

//调整数字输入框的对齐方式
:deep(#a2.ant-input-number-input) {
  text-align: right;
  width: 55px;
}


</style>
