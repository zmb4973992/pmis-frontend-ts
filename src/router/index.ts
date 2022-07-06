//createRouter用于创建路由
//createWebHashHistory用于创建哈希模式的history
//RouteRecordRaw用于限定路由记录的类型，ts专属功能
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

//懒加载路由，避免一次性导入过多而卡顿
const routes: RouteRecordRaw[] = [
    {
        path:'/',
        name:'home',
        component: () => import('../pages/home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/login.vue')
    },
    {
        path:'/test',
        name:'test',
        component: () => import('../pages/test.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router
