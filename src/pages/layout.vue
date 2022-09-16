<template>
  <a-layout class="layout">
    <a-layout-sider width="180px">
      <Logo></Logo>
      <Sider></Sider>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <div class="test">
          测试
        </div>
      </a-layout-header>
      <a-layout-content>内容区域</a-layout-content>
    </a-layout>
  </a-layout>


</template>

<script setup lang="ts">
import {onMounted, ref,reactive} from 'vue'
import {useRouter} from 'vue-router'
import userUserStore from "@/store/user";
import request from "@/util/axios";
import Sider from '@/components/Sider.vue'  //侧边栏组件
import Logo from '@/components/Logo.vue'
import {
  GetUser,
  IUpdateUser,
  ICreateUser,
  UpdateUser,
  CreateUser, DeleteUser, GetUserList, IUserList
} from "@/api/user";

import {
  IRelatedParty,
  GetRelatedParty,
  UpdateRelatedParty,
  CreateRelatedParty,
  DeleteRelatedParty, IRelatedPartyList, GetRelatedPartyList
} from "@/api/related_party";
import {
  GetDepartment,
  UpdateDepartment,
  CreateDepartment,
  DeleteDepartment,
  GetDepartmentList,
  IDepartment,
  IDepartmentList
} from "@/api/department";
import {
  GetDisassembly,
    UpdateDisassembly,
    CreateDisassembly,
    CreateDisassemblyInBatches,
    DeleteDisassembly,
    GetDisassemblyList,
    IDisassembly,
    IDisassemblyList,
} from "@/api/disassembly";


const router = useRouter()

const user = userUserStore()

onMounted(() => {
  request.post('/api/login', {
    username: 'a',
    password: 'a',
  });

  //测试
  // let param: ICreateUser = {
  //   full_name: 'kdf',
  //   email_address: "skdfk@kdfj.com",
  //   is_valid: false,
  //   mobile_phone_number: '3898493',
  //   employee_number: '347384',
  //   username: 'b',
  //   password: 'bksdfjej83h&^@JHFH#IFIisjdf3uyg^G'
  // }
  // GetUser(14).then(res => (console.log(res.data.data)))
  // UpdateUser(14, param).then(res => (console.log(res.data)))
  // CreateUser(param).then(res=>(console.log(res.data)))
  // DeleteUser(104).then(res=>(console.log(res.data)))
  // let param: IUserList = {
  //   page_size:10
  // }
  // GetUserList(param).then(res => (console.log(res.data)))
  // GetRelatedParty(34).then(res=>console.log(res))


  // let param: IRelatedParty = {
  //   chinese_name: '附件二123',
  //   english_name: 'fine111',
  //   address: '看到飞机上的分1111开久了',
  //   uniform_social_credit_code: '388d3kg712123kd',
  //   telephone: '1383991111148374'
  // }
  // let relatedPartyID = 33
  // UpdateRelatedParty(relatedPartyID, param).then(res => (console.log(res.data)))

  // CreateRelatedParty(param).then(res => (console.log(res.data)))
  // DeleteRelatedParty(67).then(res=>(console.log(res.data)))
  // let param :IRelatedPartyList = {
  //   id_gte:60
  // }
  // GetRelatedPartyList(param).then(res=>(console.log(res.data)))

  // let param: IDepartmentList = {
  //   name_include: '一',
  //
  // }
  // let departmentID = 118
  // // GetDepartment(departmentID).then(res=>console.log(res))
  //
  // GetDepartmentList(param).then(res => console.log(res))

  // let param1 :IDisassembly = {
  //   name: 'dfef3',
  //   project_id: 1,
  //   level: 3,
  //   weight: 0.8,
  //   superior_id: 33
  // }
  // let param2 : IDisassembly[] = [{
  //   name: 'dfef3',
  //   project_id: 1,
  //   level: 3,
  //   weight: 0.8,
  //   superior_id: 33
  // },{
  //   name: 'dfef3',
  //   project_id: 1,
  //   level: 3,
  //   weight: 0.8,
  //   superior_id: 33
  // }]
  // let disassemblyID = 5
  // let param3:IDepartmentList = {
  // level_gte:40,
  //   page:2,
  //   page_size:2
  // }
  // GetDisassembly(disassemblyID).then(res => console.log(res))
  // UpdateDisassembly(disassemblyID,param1).then(res => console.log(res))
  // CreateDisassemblyInBatches(param2)
  // DeleteDisassembly(19)
  // GetDisassemblyList(param3).then(res => console.log(res))
})

</script>

<style scoped lang="less">
.layout {
  height: 100vh;
  width: 100vw;

  .ant-layout-sider {
    background: burlywood;
  }
}


.ant-layout-header {
  background: cornflowerblue;
  height: 50px;
}

.ant-layout-content {
  background: antiquewhite;
}

.ant-layout-footer {
  background: cornsilk;
}
</style>
