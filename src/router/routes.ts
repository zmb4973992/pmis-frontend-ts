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
            requireAuth: true,
            permittedRoles: ['a', 'b', '管理员'],  //允许哪些角色访问
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            //以下为进度
            {
                path: '/progress/disassembly',
                name: '拆解项目',
                meta: {
                    title: '拆解项目',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/progress/disassembly.vue')
            },
            {
                path: '/progress/status',
                name: '当前情况',
                meta: {
                    title: '当前情况',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/progress/status.vue')
            },
            {
                path: '/progress/snapshot',
                name: '历史快照',
                meta: {
                    title: '历史快照',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/progress/historical_snapshot.vue'),
            },
            {
                path: '/progress/warning',
                name: '进度预警',
                meta: {
                    title: '历史快照',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/progress/historical_snapshot.vue'),
            },
            {
                path: '/progress/update_log',
                name: '更新日志',
                meta: {
                    title: '更新日志',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/progress/update_log.vue'),
            },
            //以下为项目
            {
                path: '/project/list',
                name: '项目列表',
                meta: {
                    title: '项目列表',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/project/list.vue'),
            },
            {
                path: '/project/member',
                name: '成员管理',
                meta: {
                    title: '成员管理',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/project/member_management.vue'),
            },
            {
                path: '/project/performance',
                name: '历史业绩',
                meta: {
                    title: '历史业绩',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/project/historical_performance.vue'),
            },
            //以下为相关方
            {
                path: '/related-party/list',
                name: '相关方列表',
                meta: {
                    title: '相关方列表',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/related_party/list.vue')
            },
            //以下为消息中心
            {
                path:'/message',
                name:'消息中心',
                meta:{
                    title:'消息中心',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/message/index.vue')
            },

        ],
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            requireAuth: false,
            permittedRoles: [],
        },
        component:
            () => import('@/pages/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '权限不足，无法访问',
            requireAuth: false,
        },
        component:
            () => import('@/pages/403.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        meta: {
            title: '页面不存在',
            requireAuth: false,
        },
        component:
            () => import('@/pages/404.vue'),
    },
]

export default routes
