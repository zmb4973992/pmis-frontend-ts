import {defineStore} from "pinia";

// @ts-ignore
const userUserStore = defineStore({
    id: 'user',
    state: () => ({
        token: '',
        username: '',
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

export default userUserStore
