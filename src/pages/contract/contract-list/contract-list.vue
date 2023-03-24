<template>
  <a-form class="query-form">
    <!--这里用a-row，是为了确保表单元素在一行内，如果内容超出一行，可以自动换行-->
    <a-row :gutter="10">
      <a-col>
        <a-form-item class="query-form-item" label="项目名称" style="width: 250px">
          <a-select>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item class="query-form-item" label="合同名称" style="width: 220px">
          <a-input placeholder="支持模糊搜索">

          </a-input>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item class="query-form-item">
          <a-button-group>
            <a-button class="button" type="primary" @click="loadList">
              <template #icon>
                <SearchOutlined/>
              </template>
              查询
            </a-button>
            <a-button class="button" @click="reset" v-permitted-roles="['a','事业部级']">
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


  <!--用a-card包裹，是为了后期添加loading效果，以及设置整体的内外边距、背景色等-->
  <a-card size="small" :bordered="false" style="margin-top: 10px;">
    <!--  表格主体-->
    <a-row class="table-buttons-row">
      <a-button size="small" type="primary" @click="create">
        <template #icon>
          <PlusOutlined/>
        </template>
        添加合同
      </a-button>
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
    <a-table :data-source="data.list" :columns="columns"
             size="small" :pagination="false" :scroll="{x:1500}">
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
    <a-pagination v-model:pageSize="queryForm.page_size" :total="data.numberOfRecords"
                  showSizeChanger :pageSizeOptions="pageSizeOptions"
                  showQuickJumper @change="paginationChange"
                  :show-total="total=>`共${total}条记录`"/>
  </a-card>

</template>

<script setup lang="ts">
//查询条件
import {reactive, ref} from "vue";
import {SearchOutlined,RedoOutlined,PlusOutlined} from "@ant-design/icons-vue";

//查询条件
const queryForm = reactive({
  is_showed_by_role: false,
  project_id_in: [],
  fund_direction: '',
  name_include: '',
  code_include: '',
  page: 1,
  page_size: 12,
  order_by: "",
  desc: false,
})

const data = reactive({
  list: [],
  numberOfPages: 1,
  numberOfRecords: 1,
})

const columns = ref([
  {
    title: '行号',
    dataIndex: 'line_number',
    className: 'line_number',
    width: '50px',
    fixed: 'left',
    ellipsis: true,
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    className: 'name',
    width: '260px',
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '项目号',
    dataIndex: 'code',
    className: 'code',
    width: '160px',
    ellipsis: true,
    sorter: (a: any, b: any) => a.project_code - b.project_code
  },
  {
    title: '所在国家',
    className: 'country',
    dataIndex: ['country', 'name'],
    width: '100px',
    ellipsis: true,
  },
  {
    title: '项目类型',
    className: 'type',
    dataIndex: ['type', 'name'],
    width: '300px',
    ellipsis: true
  },
  {
    title: '金额',
    className: 'amount',
    dataIndex: 'amount',
    width: '100px',
    ellipsis: true,
    sorter: (a: any, b: any) => a.amount - b.amount
  },
  {
    title: '币种',
    className: 'currency',
    dataIndex: ['currency', 'name'],
    width: '150px',
    ellipsis: true
  },
  {
    title: '状态',
    className: 'status',
    dataIndex: ['status', 'name'],
    width: '100px',
    ellipsis: true,
  },
  {
    title: '所属部门',
    className: 'department',
    dataIndex: ['department', 'name'],
    width: '300px',
    ellipsis: true
  },
  {
    title: '操作',
    className: 'action',
    dataIndex: 'action',
    width: '150px',
    fixed: 'right',
    ellipsis: true,
  },
])

</script>

<style lang="scss">
.query-form {
  background-color: white;
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;

  .query-form-item {
    margin: {
      top: 10px;
      bottom: 0;
    }
  }
}


//表单操作按钮的样式
.table-buttons-row {
  background-color: white;
  justify-content: space-between;
  margin-bottom: 10px;

  .buttons-for-table-setting {
    float: right;
  }
}


//表格内容居中
.ant-table {
  th.line_number, td.line_number, th.name, td.name, th.code, td.code,
  th.type, td.type, th.department, td.department, th.amount,
  th.country, td.country, th.status, td.status,
  th.currency, td.currency, th.action, td.action, th.button, td.button {
    text-align: center;
  }

  td.amount {
    text-align: right;
  }

  ::-webkit-scrollbar-thumb {
    /* 滚动条里的小方块 */
    border-radius: 5px;
    background: #c9c9c9;
  }

  ::-webkit-scrollbar-track {
    /* 滚动条里面的轨道 */
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
}

.ant-pagination {
  background-color: white;
  text-align: right;
  padding: {
    top: 10px;
  }
  .ant-select-item-option-content {
    text-align: center;
  }
}

//滚动条样式，默认不显示表格的滚动条
:deep(.ant-table) {
  ::-webkit-scrollbar {
    display: none;
  }

  //由于滚动条默认不显示，这里需要给滚动条预留边界，否则鼠标移入表格时会影响下面内容的排布
  .ant-table-content {
    padding-bottom: 8px;
  }
}

//滚动条样式，鼠标移入表格后显示滚动条
:deep(.ant-table:hover) {
  ::-webkit-scrollbar {
    /* 滚动条整体样式 */
    width: 8px;
    height: 8px;
    display: block;
  }

  //由于这里显示了滚动条，所以之前预留的padding需要取消
  .ant-table-content {
    padding-bottom: 0;
  }
}
</style>
