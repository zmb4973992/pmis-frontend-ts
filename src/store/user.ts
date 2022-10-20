import {defineStore} from "pinia";
import request from "@/util/request";

//用来储存用户信息
const useUserStore = defineStore(
    'user',
    {
        state: () => ({
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
            updateUserInfo() {
                const token = localStorage.getItem('access_token')
                if (token) {
                    this.token = token
                    request.get(
                        '/api/user'
                    ).then(
                        res => {
                            //如果token有效，就保留到store；
                            //如果token无效，就删掉本地的token
                            if (res.data.code === 0) {
                                this.username = res.data.data.username
                                this.full_name = res.data.data.full_name
                                this.roles = res.data.data.roles
                                this.departments = res.data.data.departments
                            } else {
                                localStorage.removeItem('access_token')
                            }
                        },
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
