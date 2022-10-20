import {defineStore} from "pinia";

//用来储存用户信息
const useUserStore = defineStore(
    'user',
    {
        state: () => ({
            token: '',
            username: '',
            full_name:'',
            roles: [],
        }),
        //类似computed
        getters: {
            testToken: (state) => ('aaa' + state.token),
            test2(): string[] {
                return ['a', 'b']
            }
        },
        actions: {
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
