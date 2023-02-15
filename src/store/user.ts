import {defineStore} from "pinia";
import request from "@/utils/request";
import {userState} from "@/store/interface";
import {GetRoles} from "@/api/role-and-user";

//用来储存用户信息
const useUserStore = defineStore(
    'user',
    {
        state: (): userState => ({
            access_token: '',
            username: '',
            full_name: '',
            roles: [],
            departments: [],
        }),
        //类似computed
        getters: {
            testToken: (state) => ('aaa' + state.access_token),
            test2(): string[] {
                return ['a', 'b']
            }
        },
        actions: {
            //向后端请求userInfo，并并更新到store
            updateUserInfo() {
                const token = localStorage.getItem('access_token')
                if (token) {
                    this.access_token = token
                    //获取基本的用户信息
                    request.get(
                        '/api/user'
                    ).then(
                        res => {
                            //如果token有效，就保留到store；
                            //如果token无效，就删掉本地的token
                            if (res.data.code === 0) {
                                this.username = res.data.data.username
                                this.full_name = res.data.data.full_name
                            } else {
                                localStorage.removeItem('access_token')
                            }
                        },
                    )
                    //获取用户角色
                    GetRoles().then(
                        res => {
                            //如果token有效，就保留到store；
                            //如果token无效，就删掉本地的token
                            if (res.code === 0) {
                                this.roles = res.data.role_names
                            } else {
                                localStorage.removeItem('access_token')
                            }
                        }
                    )
                }

            },
            updateToken(token: string) {
                this.access_token = token
            },
            updateRoles(roles: []) {
                this.roles = roles
            },
            resetState() {
                this.access_token = ''
            }
        },
    })

export default useUserStore
