import {defineStore} from "pinia";

const useLayoutStore = defineStore(
    'layout',
    {
        state: () => ({
            isCollapsed: false,
        }),
        getters: {},
        actions: {
            changeCollapseStatus() {
                this.isCollapsed = !this.isCollapsed
            }
        },
    }
)

export default useLayoutStore
