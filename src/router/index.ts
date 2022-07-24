//createRouter用于创建路由
//createWebHashHistory用于创建哈希模式的history
//RouteRecordRaw用于限定路由记录的类型，ts专属功能
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

import {useRouter} from "vue-router";

const myRouter = useRouter()

//懒加载路由，避免一次性导入过多而卡顿
//这里的变量名之所以为routes，是为了下面的router能直接使用这个名称，这是es6简写原则
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        //meta用于自定义页面信息
        meta: {
            title: '首页',
            hiddenInSider:true,
            requireAuth: true,
            permittedRoles: [],  //允许哪些角色访问

        },
        component: () => import('@/pages/layout.vue'),
    },
    {
        path: '/test',
        name: 'test',
        //meta用于自定义页面信息
        meta: {
            title: '测试',
            hiddenInSider:false,
            requireAuth: false,
            permittedRoles: [],
        },
        component: () => import('@/pages/layout.vue'),
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hiddenInSider: true,
            requireAuth: false,
            permittedRoles: [],
        },
        component: () => import('@/pages/login.vue'),
        beforeEnter: () => {
            //如果已登录，就直接跳转到首页
            const token = localStorage.getItem('access_token')
            if (token) {
                return {name:'home'}
            }
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        meta: {
            title: '页面未找到',
            hiddenInSider:true,
            requireAuth: false,
            permittedRoles: [],
        },
        component: () => import('@/pages/404.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {
    NProgress.start()
    // 先判断该页是否需要登录。如果需要登录：
    if (to.meta.requireAuth === true) {
        const token = localStorage.getItem('access_token')
        // 如果本地有token
        if (token) {
            return
        }
        //本地没有token，重定向到登录页
        return {name: 'login'}
    }
})

router.afterEach(() => {
    NProgress.done() // 进度条结束
})

// 进度条的配置项：ease可以设置css3动画，如ease，linear；speed是进度条从开始到结束的耗时
NProgress.configure({});

export default router
