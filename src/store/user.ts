import {defineStore} from "pinia";
import request from "@/utils/request";
import {userState} from "@/store/interface";

//用来储存用户信息
const useUserStore = defineStore(
    'user',
    {
        state: ():userState => ({
            token: '',
            username: '',
            full_name: '',
            roles: [],
            departments: [],
        }),
        //类似computed
        getters: {
            testToken: (state) => ('aaa' + state.token),
            test2(): string[] {
                return ['a', 'b']
            }
        },
        actions: {
            //向后端请求userInfo，并并更新到store
            updateUserInfo() {
                const token = localStorage.getItem('access_token')
                if (token) {
                    this.token = token
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
                    request.get(
                        '/api/role_and_user/by_token_in_header'
                    ).then(
                        res => {
                            //如果token有效，就保留到store；
                            //如果token无效，就删掉本地的token
                            if (res.data.code === 0) {
                                this.roles = res.data.data.role_names
                            } else {
                                localStorage.removeItem('access_token')
                            }
                        }
                    )
                }

            },
            updateToken(token: string) {
                this.token = token
            },
            updateRoles(roles: []) {
                this.roles = roles
            },
            resetState() {
                this.token = ''
            }
        },
    })

export default useUserStore
