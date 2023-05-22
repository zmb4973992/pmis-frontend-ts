import {defineStore} from "pinia";
import request from "@/utils/request";

//用来储存路由信息
const useRouteStore = defineStore(
    'route',
    {
        state: () => ({
            accessToken: '',
            username: '',
        }),
        //类似computed
        getters: {
            testToken: (state) => ('aaa' + state.accessToken),
            test2(): string[] {
                return ['a', 'b']
            }
        },
        actions: {
            //向后端请求路由信息，并并更新到store
            updateRoute() {
                const token = localStorage.getItem('access_token')
                if (token) {
                    this.accessToken = token
                    //获取基本的用户信息
                    request.get(
                        '/menu/list'
                    ).then(
                        res => {
                            //如果token有效，就保留到store；
                            //如果token无效，就删掉本地的token
                            if (res.data.code === 0) {
                                this.username = res.data.data.username
                            } else {
                                localStorage.removeItem('access_token')
                            }
                        },
                    )
                    //获取用户角色
                    // GetRoles().then(
                    //     res => {
                    //         //如果token有效，就保留到store；
                    //         //如果token无效，就删掉本地的token
                    //         if (res.code === 0) {
                    //             this.roles = res.data.role_names
                    //         }
                    //     }
                    // )
                }

            },
            updateToken(token: string) {
                this.accessToken = token
            },
            updateRoles(roles: []) {
                this.roles = roles
            },
            resetState() {
                this.accessToken = ''
            }
        },
    })

export default useUserStore
