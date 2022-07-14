//createRouter用于创建路由
//createWebHashHistory用于创建哈希模式的history
//RouteRecordRaw用于限定路由记录的类型，ts专属功能
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import request from "@/util/axios";

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
            requireAuth: true
        },
        component: () => import('@/pages/home.vue'),
    },
    {
        path: '/test',
        name: 'test',
        //meta用于自定义页面信息
        meta: {
            title: '测试',
            requireAuth: false
        },
        component: () => import('@/pages/home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login.vue'),
        beforeEnter: () => {
            //如果已登录，就直接跳转到首页
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/pages/404.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to,from) => {
    NProgress.start()
    if (to.meta.requireAuth === true ) {
        if (to.name === 'login') {
            const token = localStorage.getItem('access_token')
            if (token) {
                console.log('发现本地有token，允许访问')
            }
            console.log('本地没有token，跳转到登录页')
        }
        myRouter.push({name:'home'})
    }
})

router.afterEach(() => {
    NProgress.done() // 进度条结束
})

// 进度条的配置项：ease可以设置css3动画，如ease，linear；speed是进度条从开始到结束的耗时
NProgress.configure({});

export default router
