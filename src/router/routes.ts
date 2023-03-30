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
            permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],  //允许哪些角色访问
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
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/progress/disassembly/disassembly.vue')
            },
            {
                path: '/progress/list',
                name: '当前情况（表格）',
                meta: {
                    title: '当前情况',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/progress/progress-list/progress-list.vue')
            },
            {
                path: '/progress/chart',
                name: '当前情况（示意图）',
                meta: {
                    title: '当前情况',
                    // requireAuth: true,
                    // permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/progress/progress-chart/progress-chart.vue')
            },
            {
                path: '/progress/snapshot',
                name: '历史快照',
                meta: {
                    title: '历史快照',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/progress/historical-snapshot.vue'),
            },
            {
                path: '/progress/warning',
                name: '进度预警',
                meta: {
                    title: '历史快照',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/progress/historical-snapshot.vue'),
            },
            {
                path: '/progress/update_log',
                name: '更新日志',
                meta: {
                    title: '更新日志',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/progress/update-log.vue'),
            },
            //以下为项目
            {
                path: '/project/list',
                name: '项目列表',
                meta: {
                    title: '项目列表',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/project/project-list/project-list.vue'),
            },
            {
                path: '/project/member',
                name: '成员管理',
                meta: {
                    title: '成员管理',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/project/member-management.vue'),
            },
            {
                path: '/project/performance',
                name: '历史业绩',
                meta: {
                    title: '历史业绩',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/project/historical-performance.vue'),
            },
            //以下为合同
            {
                path:'/contract/list',
                name:'合同列表',
                meta : {
                    title: '合同列表',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component : () => import('@/pages/contract/contract-list/contract-list.vue')
            },
            //以下为相关方
            {
                path: '/related-party/list',
                name: '相关方列表',
                meta: {
                    title: '相关方列表',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/related_party/related-party-list.vue')
            },
            //以下为消息中心
            {
                path:'/message',
                name:'消息中心',
                meta:{
                    title:'消息中心',
                    requireAuth: true,
                    permittedRoles: ['管理员','公司级','事业部级','部门级','项目级'],
                },
                component: () => import('@/pages/message/index.vue')
            },
            //以下为用户管理
            {
                path:'/user_management/organization_structure',
                name:'组织结构',
                meta:{
                    title:'组织结构',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: ()=>import('@/pages/user_management/organization_structure.vue')
            },
            //以下为测试
            {
                path:'/test',
                name:'测试',
                component: ()=>import('@/pages/test.vue')
            },

        ],
    },
    {
        path: '/login',
        name: '登录',
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
