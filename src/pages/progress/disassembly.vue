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
              <a @click.stop="createDisassembly(key)"><PlusOutlined class="button"/></a>
              <a v-if="level !== 1" @click.stop="editDisassembly(key)"><EditOutlined class="button"/></a>
              <a v-if="level !== 1" @click.stop="deleteDisassembly(key)"><DeleteOutlined class="button"/></a>
          </span>
            </template>
          </a-tree>
        </div>
      </div>
    </div>

    <!--添加子项目的模态框-->
    <a-modal v-model:visible="visibilityOfModalForCreatingDisassembly" :after-close="resetForm"
             @ok="submitForm" style="width: 450px;">

      <a-form ref="formForCreateDisassembly" :model="dataForCreatingDisassembly"
              @finish="onFinish">
        <div style="margin-bottom: 5px">
          <span style="margin-right: 127px">名称：</span>
          <span>权重：</span>
        </div>
        <a-space v-for="(disassemblyItem, index) in dataForCreatingDisassembly.disassemblyItems"
                 style="display: flex; margin-bottom: 0" align="baseline">
          <a-form-item :name="['disassemblyItems', index, 'name']" style="width: 160px"
                       :rules="{required: true, message: '请填写名称'}">
            <a-input v-model:value="disassemblyItem.name"/>
          </a-form-item>
          <a-form-item :name="['disassemblyItems', index, 'weight']"
                       :rules="{required: true, message: '请填写权重'}">
            <a-input-number v-model:value="disassemblyItem.weight" :controls="false"
                            id="a1" addon-after="%" min="0" max="100"/>
          </a-form-item>

          <MinusCircleOutlined v-if="dataForCreatingDisassembly.disassemblyItems.length > 1"
                               @click="removeItem(disassemblyItem)"/>
        </a-space>
        <a-form-item>
          <a-button @click="addItem">
            <PlusOutlined/>
            添加一行
          </a-button>
        </a-form-item>

        <div> 选中的disassembly_id：{{ selected_key }}</div>
        {{ dataForCreatingDisassembly.disassemblyItems }}
      </a-form>

    </a-modal>

    <!--修改单项的模态框-->
    <a-modal v-model:visible="visibilityOfModalForUpdatingDisassembly" @ok="">
      <a-form-item label="名称：">
        <a-input v-model:value="dataForUpdatingDisassembly.name"></a-input>
      </a-form-item>
      <a-form-item label="权重：">
        <a-input-number v-model:value="dataForUpdatingDisassembly.weight">
        </a-input-number>
      </a-form-item>

    </a-modal>


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
//项目选择框的过滤器（下拉框搜索）
import {FormInstance, message} from "ant-design-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import * as echarts from 'echarts';
import {GetDisassembly, GetDisassemblyTree} from "@/api/disassembly";

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

const change = (key: any) => {
  console.log(key)
  setTimeout(() => {
    let chart2 = echarts.init(document.getElementById('chart2') as HTMLElement)
    chart2.resize()
  }, 10)
}

const visibilityOfModalForCreatingDisassembly = ref(false)
const visibilityOfModalForUpdatingDisassembly = ref(false)

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

let selected_key = ref<number>()

const createDisassembly = (key: number) => {
  console.log('key:', key, '，触发了create')
  visibilityOfModalForCreatingDisassembly.value = true
  dataForCreatingDisassembly.disassemblyItems = [{name: '', weight: null}]
  selected_key.value = key
}
const editDisassembly = (key: number) => {
  console.log('key:', key, '，触发了edit')
  visibilityOfModalForUpdatingDisassembly.value = true
  GetDisassembly(key).then(
      res => {
        dataForUpdatingDisassembly.value = res.data
        console.log(dataForUpdatingDisassembly.value)
      }
  )
}
const deleteDisassembly = (key: number) => console.log('key:', key, '，触发了delete1')

interface disassemblyItem {
  name: string,
  weight: number | null
}

const formForCreateDisassembly = ref<FormInstance>();
const dataForCreatingDisassembly = reactive<{ disassemblyItems: disassemblyItem[] }>({
  disassemblyItems: [],
});

const dataForUpdatingDisassembly = ref<disassemblyItem>(
    {
      name: '',
      weight: null
    }
)

const removeItem = (item: disassemblyItem) => {
  let index = dataForCreatingDisassembly.disassemblyItems.indexOf(item);
  if (index !== -1) {
    dataForCreatingDisassembly.disassemblyItems.splice(index, 1);
  }
};
const addItem = () => {
  dataForCreatingDisassembly.disassemblyItems.push({
    name: '',
    weight: null,
  });
};
const onFinish = (values: any) => {
  console.log('Received values of form:', values);
  console.log('dynamicValidateForm.users:', dataForCreatingDisassembly.disassemblyItems);
};


const resetForm = () => {
  formForCreateDisassembly.value!.clearValidate();
}

function submitForm() {
  formForCreateDisassembly.value!.validateFields().then(
      (res) => {
        console.log('结果是：')
        console.log(res)
      },
  )
}

function percentToDecimal(value: string) {
  let str = value.replace('%', '')
  let res = Number(str)
  res = res / 100
  return res
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


</style>
