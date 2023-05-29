import {defineStore} from "pinia";
import {customRouteRecord} from "@/router/routes";

//用来储存路由信息
const useMenuStore = defineStore(
    'menu',
    {
        state: () => ({
            menuTree: [] as customRouteRecord[],
        }),
        //类似computed
        getters: {},
        actions: {
            //向后端请求路由信息，并并更新到store
            updateMenus(menuList: any[]) {
                try {
                    this.menuTree = menuList
                } catch (e) {
                    console.log(e);
                }
            },
        },
    })

export default useMenuStore

