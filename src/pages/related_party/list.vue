<template>
  <div class="a">
    <a-table class="table" :data-source="dataSource" :columns="columns">
    </a-table>
    <div>1</div>
    <div class="test">1</div>
    <div>1</div>

  </div>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {GetRelatedPartyList} from "@/api/related_party";
import useUserStore from "@/store/user";

let dataSource = ref([])
let columns = ref([
  {
    title: '中文名',
    dataIndex: 'chinese_name',
    key: 'chinese_name',
  },
  {
    title: '英文名',
    dataIndex: 'english_name',
    key: 'english_name',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '电话',
    dataIndex: 'telephone',
    key: 'telephone',
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'uniform_social_credit_code',
    key: 'uniform_social_credit_code',

  },

])

GetRelatedPartyList().then(
    (res) => {
      dataSource.value = res.data
      // console.log(dataSource.value[0]);
    }
)

let userInfo = useUserStore()


</script>

<style scoped lang="scss">

</style>
