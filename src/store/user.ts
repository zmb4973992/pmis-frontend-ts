import {defineStore} from "pinia";

const userUserStore = defineStore({
    id: 'user',
    state: () => ({
        token: '',
        username: '',
        roles:[],
    }),
    getters: {
        testToken: (state) => 'aaa' + state.token ,
    },
    actions: {
        updateToken(token: string) {
            this.token = token
        }
    }
})

export default userUserStore
