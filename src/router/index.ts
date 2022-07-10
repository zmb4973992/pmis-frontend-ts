//createRouter用于创建路由
//createWebHashHistory用于创建哈希模式的history
//RouteRecordRaw用于限定路由记录的类型，ts专属功能
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

//懒加载路由，避免一次性导入过多而卡顿
//这里的变量名之所以为routes，是为了下面的router能直接使用这个名称，这是es6简写原则
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        //meta用于自定义页面信息
        meta: {
            title: '首页',
            requireAuth: false
        },
        component: () => import('../pages/home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: ()=> import('@/pages/404.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {

})

export default router
