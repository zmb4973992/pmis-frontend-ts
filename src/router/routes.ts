//懒加载路由，避免一次性导入过多而卡顿
//这里的变量名之所以为routes，是为了下面的router能直接使用这个名称，这是es6简写原则
import {RouteRecordRaw} from "vue-router";

 const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        //meta用于自定义页面信息
        meta: {
            title: '首页',
            hiddenInSider: true,
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
            hiddenInSider: false,
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
                return {name: 'home'}
            }
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        meta: {
            title: '页面未找到',
            hiddenInSider: true,
            requireAuth: false,
            permittedRoles: [],
        },
        component: () => import('@/pages/404.vue')
    },
]

export default routes
