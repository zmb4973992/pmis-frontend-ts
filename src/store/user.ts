import {defineStore} from "pinia";

const userUserStore = defineStore({
    id: 'user',
    state: () => ({
        name: 'tom',
        age: 22,
        token:''
    }),
    getters: {
        doubleAge: (state) => state.age * 2,
    },
    actions: {
        increment(num:number) {
            this.age += num
        },
        updateToken(token) {
            this.token = token
        }
    }
})

export default userUserStore
