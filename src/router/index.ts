//createRouter用于创建路由
//createWebHashHistory用于创建哈希模式的history
//RouteRecordRaw用于限定路由记录的类型，ts专属功能
import {createRouter, createWebHashHistory} from "vue-router";
//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import routes, {customRouteRecord, privateRoutes} from "@/router/routes";
import useMenuStore from "@/store/menu";
import useUserStore from "@/store/user";
import {routeName} from "@/utils/routeName";

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {
    if (to.name == '登录') {
        return
    }

    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
        localStorage.clear()
        return {name: '登录'}
    }
})

router.afterEach(() => {
    NProgress.done() //进度条结束
})

// 进度条的配置项：ease可以设置css3动画，如ease，linear；speed是进度条从开始到结束的耗时
NProgress.configure({showSpinner: false,});

const modules = import.meta.glob('@/pages/**/*.vue')

export function buildRoutes(menu: any[]) {
    for (let item of menu) {
        if (item?.path) {
            router.addRoute(
                {
                    path: item.path,
                    name: item.name,
                    component: modules[item.component],
                    meta: {
                        hidden: item.meta.hidden_in_sider,
                        title: item.meta.title,
                        icon: item.meta.icon,
                        label: item.meta.label,
                    },
                }
            )
        }
        if (item?.children) {
            buildRoutesRecursion(item.name, item.children)
        }
    }
}

function buildRoutesRecursion(routeName: string, menu: any[]) {
    for (let item of menu) {
        if (item?.path) {
            router.addRoute(
                routeName,
                {
                    path: item.path,
                    name: item.name,
                    component: modules[item.component],
                    meta: {
                        hidden: item.meta.hidden_in_sider,
                        title: item.meta.title,
                        icon: item.meta.icon,
                        label: item.meta.label,
                    },
                }
            )
        }
        if (item?.children) {
            buildRoutesRecursion(item.name, item.children)
        }
    }
}

export default router
