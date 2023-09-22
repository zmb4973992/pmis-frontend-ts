<template>
  <a-row :gutter="10">
    <a-col :span="8">
      <a-spin :spinning="data.approvedProject.loading">
        <a-card>
          <template #title>
            <span style="font-size: 25px">
              新立项的项目
            </span>
          </template>
          <template #extra>
            <a-tag color="green" style="padding: 5px">
              <span style="font-size: 20px">
                本月
              </span>
            </a-tag>
          </template>
          <router-link target="_blank" :to="{
            name:'项目列表',
            query:{
              start_date:dayjs().startOf('month').format('YYYY-MM-DD'),
              end_date:dayjs().endOf('month').format('YYYY-MM-DD'),
              collapsed:'no',
            }
          }">
          <span style="font-size: 50px">
        {{ data.approvedProject.numberOfThisMouth }}
          </span>
            <span style="font-size: 25px"> 个</span>
          </router-link>
          <a-divider style="margin-top: 10px;margin-bottom: 10px;"/>
          <span style="font-size: 20px">上月</span>
          <span style="font-size: 20px">
        {{ data.approvedProject.numberOfLastMouth }}
          </span>
          <span style="font-size: 20px">个，</span>
          <span style="font-size: 20px">环比：</span>
          <span :style="{
          fontSize: '20px',
          color:data.approvedProject.growthPercentage >= 0 ? 'red' : 'green'}">
          {{ data.approvedProject.growthPercentage.toFixed(0) }}%
        </span>
          <span>&nbsp</span>
          <CaretUpOutlined v-if="data.approvedProject.growthPercentage >= 0" style="color: red;font-size: 20px"/>
          <CaretDownOutlined v-else style="color: green;font-size: 20px"/>
        </a-card>
      </a-spin>

    </a-col>

    <a-col :span="8">
      <a-spin :spinning="data.approvedIncomeContract.loading">
        <a-card>
          <template #title>
            <span style="font-size: 25px">
              新增收款合同
            </span>
          </template>
          <template #extra>
            <a-tag color="green" style="padding: 5px">
              <span style="font-size: 20px">
                本月
              </span>
            </a-tag>
          </template>
          <router-link target="_blank" :to="{
            name:'合同列表',
            query:{
              fund_direction: '收款合同',
              start_date:dayjs().startOf('month').format('YYYY-MM-DD'),
              end_date:dayjs().endOf('month').format('YYYY-MM-DD'),
              collapsed:'no',
            }
          }">
          <span style="font-size: 50px">
        {{ data.approvedIncomeContract.numberOfThisMouth }}
          </span>
            <span style="font-size: 25px"> 个</span>
          </router-link>
          <a-divider style="margin-top: 10px;margin-bottom: 10px;"/>
          <span style="font-size: 20px">上月</span>
          <span style="font-size: 20px">
        {{ data.approvedIncomeContract.numberOfLastMouth }}
          </span>
          <span style="font-size: 20px">个，</span>
          <span style="font-size: 20px">环比：</span>
          <span :style="{
          fontSize: '20px',
          color:data.approvedIncomeContract.growthPercentage >= 0 ? 'red' : 'green'}">
          {{ data.approvedIncomeContract.growthPercentage.toFixed(0) }}%
        </span>
          <span>&nbsp</span>
          <CaretUpOutlined v-if="data.approvedIncomeContract.growthPercentage >= 0" style="color: red;font-size: 20px"/>
          <CaretDownOutlined v-else style="color: green;font-size: 20px"/>
        </a-card>
      </a-spin>
    </a-col>

    <a-col :span="8">
      <a-spin :spinning="data.approvedExpenditureContract.loading">
        <a-card>
          <template #title>
            <span style="font-size: 25px">
              新增付款合同
            </span>
          </template>
          <template #extra>
            <a-tag color="green" style="padding: 5px">
              <span style="font-size: 20px">
                本月
              </span>
            </a-tag>
          </template>
          <router-link target="_blank" :to="{
            name:'合同列表',
            query:{
              fund_direction: '付款合同',
              start_date:dayjs().startOf('month').format('YYYY-MM-DD'),
              end_date:dayjs().endOf('month').format('YYYY-MM-DD'),
              collapsed:'no',
            }
          }">
          <span style="font-size: 50px">
        {{ data.approvedExpenditureContract.numberOfThisMouth }}
          </span>
            <span style="font-size: 25px"> 个</span>
          </router-link>
          <a-divider style="margin-top: 10px;margin-bottom: 10px;"/>
          <span style="font-size: 20px">上月</span>
          <span style="font-size: 20px">
        {{ data.approvedExpenditureContract.numberOfLastMouth }}
          </span>
          <span style="font-size: 20px">个，</span>
          <span style="font-size: 20px">环比：</span>
          <span :style="{
          fontSize: '20px',
          color:data.approvedExpenditureContract.growthPercentage >= 0 ? 'red' : 'green'}">
          {{ data.approvedExpenditureContract.growthPercentage.toFixed(0) }}%
        </span>
          <span>&nbsp</span>
          <CaretUpOutlined v-if="data.approvedExpenditureContract.growthPercentage >= 0" style="color: red;font-size: 20px"/>
          <CaretDownOutlined v-else style="color: green;font-size: 20px"/>
        </a-card>
      </a-spin>
    </a-col>

  </a-row>

  <a-row :gutter="10" style="margin-top: 10px">
    <a-col :span="12">
      <a-spin :spinning="data.totalAmountOfActualIncome.loading">
        <a-card>
          <template #title>
            <span style="font-size: 25px">
            项目收款总额（CNY）
            </span>
          </template>
          <template #extra>
            <a-tag color="green" style="padding: 5px">
              <span style="font-size: 20px">
                本月
              </span>
            </a-tag>
          </template>
          <router-link target="_blank" :to="{
            name:'实际收款列表',
            query:{
              start_date:dayjs().startOf('month').format('YYYY-MM-DD'),
              end_date:dayjs().endOf('month').format('YYYY-MM-DD'),
            },
          }">
          <span style="font-size: 50px">
        {{ data.totalAmountOfActualIncome.numberOfThisMouth.toLocaleString() }}
          </span>
            <span style="font-size: 25px"> 元</span>
          </router-link>
          <a-divider style="margin-top: 10px;margin-bottom: 10px;"/>
          <span style="font-size: 20px">上月</span>
          <span style="font-size: 20px">
        {{ data.totalAmountOfActualIncome.numberOfLastMouth.toLocaleString() }}
          </span>
          <span style="font-size: 20px">元，</span>
          <span style="font-size: 20px">环比：</span>
          <span :style="{
          fontSize: '20px',
          color:data.totalAmountOfActualIncome.growthPercentage >= 0 ? 'red' : 'green'}">
          {{ data.totalAmountOfActualIncome.growthPercentage.toFixed(0) }}%
        </span>
          <span>&nbsp</span>
          <CaretUpOutlined v-if="data.totalAmountOfActualIncome.growthPercentage >= 0" style="color: red;font-size: 20px"/>
          <CaretDownOutlined v-else style="color: green;font-size: 20px"/>
        </a-card>
      </a-spin>
    </a-col>

    <a-col :span="12">
      <a-spin :spinning="data.totalAmountOfActualExpenditure.loading">
        <a-card>
          <template #title>
            <span style="font-size: 25px">
            项目付款总额（CNY）
            </span>
          </template>
          <template #extra>
            <a-tag color="green" style="padding: 5px">
              <span style="font-size: 20px">
                本月
              </span>
            </a-tag>
          </template>
          <router-link target="_blank" :to="{
            name:'实际付款列表',
            query:{
              start_date:dayjs().startOf('month').format('YYYY-MM-DD'),
              end_date:dayjs().endOf('month').format('YYYY-MM-DD'),
            },
          }">
          <span style="font-size: 50px">
        {{ data.totalAmountOfActualExpenditure.numberOfThisMouth.toLocaleString() }}
          </span>
            <span style="font-size: 25px"> 元</span>
          </router-link>
          <a-divider style="margin-top: 10px;margin-bottom: 10px;"/>
          <span style="font-size: 20px">上月</span>
          <span style="font-size: 20px">
        {{ data.totalAmountOfActualExpenditure.numberOfLastMouth.toLocaleString() }}
          </span>
          <span style="font-size: 20px">元，</span>
          <span style="font-size: 20px">环比：</span>
          <span :style="{
          fontSize: '20px',
          color:data.totalAmountOfActualExpenditure.growthPercentage >= 0 ? 'red' : 'green'}">
          {{ data.totalAmountOfActualExpenditure.growthPercentage.toFixed(0) }}%
        </span>
          <span>&nbsp</span>
          <CaretUpOutlined v-if="data.totalAmountOfActualExpenditure.growthPercentage >= 0" style="color: red;font-size: 20px"/>
          <CaretDownOutlined v-else style="color: green;font-size: 20px"/>
        </a-card>
      </a-spin>
    </a-col>

  </a-row>
</template>

<script setup lang="ts">
import CaretDownOutlined from '@ant-design/icons-vue/CaretDownOutlined'
import CaretUpOutlined from '@ant-design/icons-vue/CaretUpOutlined'
import {projectApi} from "@/api/project";
import {pagingFormat} from "@/interfaces/paging-interface";
import type {Dayjs} from "dayjs";
import {reactive, ref} from "vue";
import dayjs from "dayjs";
import {dictionaryDetailApi} from "@/api/dictionary-detail";
import {contractApi} from "@/api/contract";
import {incomeAndExpenditureApi} from "@/api/income-and-expenditure";

//查询条件
interface queryConditionFormat extends pagingFormat {
  approvalDateRange?: [Dayjs, Dayjs]
}

const queryCondition = reactive({
  pageSize: 0,
})

//表格数据
let data = reactive({
  approvedProject: { //新立项的项目
    loading: true,
    numberOfThisMouth: 0,  //本月新立项的项目数量
    numberOfLastMouth: 0,  //上月新立项的项目数量
    growthPercentage: 0,  //环比
  },
  approvedIncomeContract: { //新过审的收款合同
    loading: true,
    numberOfThisMouth: 0,  //本月新过审的收款合同数量
    numberOfLastMouth: 0,  //上月新过审的收款合同数量
    growthPercentage: 0,  //环比
  },
  approvedExpenditureContract: { //新过审的付款合同
    loading: true,
    numberOfThisMouth: 0,  //本月新过审的付款合同数量
    numberOfLastMouth: 0,  //上月新过审的付款合同数量
    growthPercentage: 0,  //环比
  },
  totalAmountOfActualIncome: {
    loading: true,
    numberOfThisMouth: 0,  //本月实际收款金额
    numberOfLastMouth: 0,  //上月实际收款金额
    growthPercentage: 0,  //环比
  },
  totalAmountOfActualExpenditure: {
    loading: true,
    numberOfThisMouth: 0,  //本月实际付款金额
    numberOfLastMouth: 0,  //上月实际付款金额
    growthPercentage: 0,  //环比
  },
})

//收款合同在字典详情表的id
const dictionaryDetailIdOfIncomeContract = ref()
//付款合同在字典详情表的id
const dictionaryDetailIdOfExpenditureContract = ref()

//实际(收付款的种类)在字典详情表中的id
const dictionaryDetailIdOfActual = ref()

//收款(收付款的资金方向)在字典详情表的id
const dictionaryDetailIdOfIncome = ref()
//付款(收付款的资金方向)在字典详情表的id
const dictionaryDetailIdOfExpenditure = ref()


async function loadData() {
  try {
    //获取本月新立项的项目数量
    let res1 = await projectApi.getCount({
      approval_date_gte: dayjs().startOf("month").format("YYYY-MM-DD"),
      approval_date_lte: dayjs().endOf("month").format("YYYY-MM-DD"),
    })
    if (res1?.code === 0) {
      data.approvedProject.numberOfThisMouth = res1?.data?.count
    } else {
      console.log(res1.message)
    }

    //获取上月新立项的项目数量
    let res2 = await projectApi.getCount({
      approval_date_gte: dayjs().subtract(1, "month")
          .startOf("month").format("YYYY-MM-DD"),
      approval_date_lte: dayjs().subtract(1, "month")
          .endOf("month").format("YYYY-MM-DD"),
    })
    if (res2?.code === 0) {
      data.approvedProject.numberOfLastMouth = res2?.data?.count
    } else {
      console.log(res2.message)
    }

    //计算环比
    if (data.approvedProject.numberOfLastMouth !== 0) {
      data.approvedProject.growthPercentage =
          (data.approvedProject.numberOfThisMouth -
              data.approvedProject.numberOfLastMouth) /
          data.approvedProject.numberOfLastMouth * 100
    } else {
      data.approvedProject.growthPercentage = 100
    }
  } catch (e: any) {
    console.log(e);
  } finally {
    data.approvedProject.loading = false
  }

  try {
    //获取本月新过审的收款合同数量
    let res1 = await contractApi.getCount({
      fund_direction: "收款合同",
      approval_date_gte: dayjs().startOf("month").format("YYYY-MM-DD"),
      approval_date_lte: dayjs().endOf("month").format("YYYY-MM-DD"),
    })
    if (res1?.code === 0) {
      data.approvedIncomeContract.numberOfThisMouth = res1?.data?.count
    } else {
      console.log(res1.message)
    }

    //获取上月新过审的收款合同数量
    let res2 = await contractApi.getCount({
      fund_direction: "收款合同",
      approval_date_gte: dayjs().subtract(1, "month")
          .startOf("month").format("YYYY-MM-DD"),
      approval_date_lte: dayjs().subtract(1, "month")
          .endOf("month").format("YYYY-MM-DD"),
    })
    if (res2?.code === 0) {
      data.approvedIncomeContract.numberOfLastMouth = res2?.data?.count
    } else {
      console.log(res2.message)
    }

    //计算环比
    if (data.approvedIncomeContract.numberOfLastMouth !== 0) {
      data.approvedIncomeContract.growthPercentage =
          (data.approvedIncomeContract.numberOfThisMouth -
              data.approvedIncomeContract.numberOfLastMouth) /
          data.approvedIncomeContract.numberOfLastMouth * 100
    } else {
      data.approvedIncomeContract.growthPercentage = 100
    }
  } catch (e) {
    console.log(e);
  } finally {
    data.approvedIncomeContract.loading = false
  }

  try {
    //获取本月新过审的付款合同数量
    let res2 = await contractApi.getCount({
      fund_direction: "付款合同",
      approval_date_gte: dayjs().startOf("month").format("YYYY-MM-DD"),
      approval_date_lte: dayjs().endOf("month").format("YYYY-MM-DD"),
    })
    if (res2?.code === 0) {
      data.approvedExpenditureContract.numberOfThisMouth = res2?.data?.count
    } else {
      console.log(res2.message)
    }

    //获取上月新过审的付款合同数量
    let res3 = await contractApi.getCount({
      fund_direction: "付款合同",
      approval_date_gte: dayjs().subtract(1, "month")
          .startOf("month").format("YYYY-MM-DD"),
      approval_date_lte: dayjs().subtract(1, "month")
          .endOf("month").format("YYYY-MM-DD"),
    })
    if (res3?.code === 0) {
      data.approvedExpenditureContract.numberOfLastMouth = res3?.data?.count
    } else {
      console.log(res3.message)
    }

    //计算环比
    if (data.approvedExpenditureContract.numberOfLastMouth !== 0) {
      data.approvedExpenditureContract.growthPercentage =
          (data.approvedExpenditureContract.numberOfThisMouth -
              data.approvedExpenditureContract.numberOfLastMouth) /
          data.approvedExpenditureContract.numberOfLastMouth * 100
    } else {
      data.approvedExpenditureContract.growthPercentage = 100
    }
  } catch (e) {
    console.log(e);
  } finally {
    data.approvedExpenditureContract.loading = false
  }


  try {
    //获取本月的项目收款总额
    let res1 = await incomeAndExpenditureApi.getCumulativeTotalAmount({
      kind: "实际",
      fund_direction: "收款",
      date_gte: dayjs().startOf("month").format("YYYY-MM-DD"),
      date_lte: dayjs().endOf("month").format("YYYY-MM-DD"),
    })

    if (res1?.code === 0) {
      data.totalAmountOfActualIncome.numberOfThisMouth = res1?.data?.cumulative_total_amount_in_cny
    } else {
      console.log(res1.message)
    }

    //获取上月的项目收款总额
    let res2 = await incomeAndExpenditureApi.getCumulativeTotalAmount({
      kind: "实际",
      fund_direction: "收款",
      date_gte: dayjs().subtract(1, "month")
          .startOf("month").format("YYYY-MM-DD"),
      date_lte: dayjs().subtract(1, "month")
          .endOf("month").format("YYYY-MM-DD"),
    })
    if (res2?.code === 0) {
      data.totalAmountOfActualIncome.numberOfLastMouth = res2?.data?.cumulative_total_amount_in_cny
    } else {
      console.log(res2.message)
    }

    //计算环比
    if (data.totalAmountOfActualIncome.numberOfLastMouth !== 0) {
      data.totalAmountOfActualIncome.growthPercentage =
          (data.totalAmountOfActualIncome.numberOfThisMouth -
              data.totalAmountOfActualIncome.numberOfLastMouth) /
          data.totalAmountOfActualIncome.numberOfLastMouth * 100
    } else {
      data.totalAmountOfActualIncome.growthPercentage = 100
    }
  } catch (e) {
    console.log(e);
  } finally {
    data.totalAmountOfActualIncome.loading = false
  }

  try {
    //获取本月的项目付款总额
    let res1 = await incomeAndExpenditureApi.getCumulativeTotalAmount({
      kind: "实际",
      fund_direction: "付款",
      date_gte: dayjs().startOf("month").format("YYYY-MM-DD"),
      date_lte: dayjs().endOf("month").format("YYYY-MM-DD"),
    })

    if (res1?.code === 0) {
      data.totalAmountOfActualExpenditure.numberOfThisMouth = res1?.data?.cumulative_total_amount_in_cny
    } else {
      console.log(res1.message)
    }

    //获取上月的项目付款总额
    let res2 = await incomeAndExpenditureApi.getCumulativeTotalAmount({
      kind: "实际",
      fund_direction: "付款",
      date_gte: dayjs().subtract(1, "month")
          .startOf("month").format("YYYY-MM-DD"),
      date_lte: dayjs().subtract(1, "month")
          .endOf("month").format("YYYY-MM-DD"),
    })
    if (res2?.code === 0) {
      data.totalAmountOfActualExpenditure.numberOfLastMouth = res2?.data?.cumulative_total_amount_in_cny
    } else {
      console.log(res2.message)
    }

    //计算环比
    if (data.totalAmountOfActualExpenditure.numberOfLastMouth !== 0) {
      data.totalAmountOfActualExpenditure.growthPercentage =
          (data.totalAmountOfActualExpenditure.numberOfThisMouth -
              data.totalAmountOfActualExpenditure.numberOfLastMouth) /
          data.totalAmountOfActualExpenditure.numberOfLastMouth * 100
    } else {
      data.totalAmountOfActualExpenditure.growthPercentage = 100
    }
  } catch (e) {
    console.log(e);
  } finally {
    data.totalAmountOfActualExpenditure.loading = false
  }

}

loadData()

</script>

<style scoped lang="scss">
//调整卡片标题区域的边框
:deep(.ant-card-head) {
  border-bottom: 0;
  padding-left: 15px;
  padding-right: 10px;
}

//调整卡片内容区域的边距
:deep(.ant-card-body) {
  padding: 0 15px 15px;
}

</style>
