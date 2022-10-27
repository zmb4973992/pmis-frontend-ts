import {defineStore} from "pinia";
import {ILayoutStoreState} from "@/store/interface";

const useLayoutStore = defineStore(
    'layout',
    {
        state: ():ILayoutStoreState => ({
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
