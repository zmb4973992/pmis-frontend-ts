import {defineStore} from "pinia";
import {globalState} from "@/store/interface";

const useGlobalStore = defineStore(
    'global',
    {
        state: ():globalState => ({
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

export default useGlobalStore
