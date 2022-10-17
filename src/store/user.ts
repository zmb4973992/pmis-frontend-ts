import {defineStore} from "pinia";

//用来储存全局状态
const useUserStore = defineStore(
    'user',
    {
        state: () => ({
            token: '',
            username: 'me',
            full_name:'fdf',
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
