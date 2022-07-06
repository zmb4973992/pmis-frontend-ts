import {defineStore} from "pinia";

const userUserStore = defineStore({
    id: 'user',
    state: () => ({
        name: 'tom',
        age: 22
    }),
    getters: {
        doubleAge: (state) => state.age * 2,
    },
    actions: {
        increment(num:number) {
            this.age += num
        }
    }
})

export default userUserStore
