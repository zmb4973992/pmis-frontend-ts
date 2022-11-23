<template>
  <div id="layout1">
    <!--主体区域的左侧内容-->
    <div class="left-column">
      <a-tree :show-icon="true" :tree-data="treeData" v-model:expanded-keys="expandedKeys"
              v-model:selectedKeys="selectedKeys">
        <template #title="{title,key}">
          <span class="title">
            {{ title }}
            <span class="actions">
              <a @click.stop="create" @mouseenter="floatSelect({title:title,key:key})"><PlusOutlined class="action"/></a>
              <a @click.stop="edit"><EditOutlined class="action"/></a>
              <a @click.stop="delete1"><DeleteOutlined class="action"/></a>
          </span>
          </span>
        </template>
      </a-tree>
    </div>
    <!--主体区域的右侧内容-->
    <div class="right-column">参考活字格的组织结构页面</div>
  </div>

  <a-modal v-model:visible="visible" title="创建新的子部门" @ok="ok">
    <div>上级部门名称：{{floatSelectedDepartment.title}}</div>
    <span>名称：</span>
    <a-input style="width: 220px"></a-input>
  </a-modal>
</template>

<script setup lang="ts">
import {PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import {reactive, ref, watch} from "vue";
import {GetDepartmentList} from "@/api/department";

const visible = ref(false)

const floatSelectedDepartment = reactive({title: '', key: 0})

const floatSelect = (param: treeData) => {
  floatSelectedDepartment.title = param.title
  floatSelectedDepartment.key = param.key
}

const create = () => {
  visible.value = true
}

const ok = () => {
  console.log('关闭了模态框')
  visible.value = false
}


let numberArray = []
for (let i = 1; i < 100000; i++) {
  numberArray[i] = i
}

let expandedKeys = ref(numberArray)

const getDepartmentTree = () => {
  GetDepartmentList({page_size: 100}).then(res => {
        //第一次遍历
        for (let item1 of res.data) {
          if (item1.level === "公司") {
            treeData.value.push({title: item1.name, key: item1.id, children: []})
            for (let item2 of res.data) {
              //第二次遍历
              if (item2.superior_id === item1.id) {
                let temp = []
                for (let item3 of res.data) {
                  //第三次遍历
                  if (item3.superior_id === item2.id) {
                    temp.push({title: item3.name, key: item3.id})
                  }
                }
                treeData.value[0].children?.push(
                    {title: item2.name, key: item2.id, children: temp}
                )
              }
            }
            break
          }
        }
      }
  )
}

getDepartmentTree()

interface treeData {
  title: string
  key: number
  children?: treeData[]
}

let treeData = ref<treeData[]>([])

const selectedKeys = ref([]);

watch(selectedKeys, () => {
  console.log(selectedKeys.value[0])
})

</script>

<style scoped lang="scss">

#layout1 {
  overflow-x: auto;

  .left-column {
    float: left;
    width: 250px;
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
    margin-left: 260px;
    width: calc(100% - 260px);
    background-color: white;
  }
}

</style>
