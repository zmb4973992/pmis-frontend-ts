//这里的变量名之所以为routes，是为了下面的router能直接使用这个名称，这是es6简写原则
import {RouteRecordRaw} from "vue-router";
import {routeName} from "@/utils/routeName";

//把route的meta限定的更细致一些，便于引用和类型判定
export type customRouteRecord = RouteRecordRaw & {
    meta?: {
        label?: string, //标签、显示名称
        icon?: string, //图标
        hidden?: boolean, //是否在目录中隐藏
        requireAuth?: boolean, //是否需要根据角色鉴权
        permittedRoles?: string[] //允许哪些角色访问
    }
    children?: customRouteRecord[]
}

const routes: customRouteRecord[] = [
    {
        path: '/home',
        name: routeName.homePage,
        meta: {
            label: '首页',
            icon: 'HomeOutlined',
            requireAuth: true,
            permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
        },
        component: () => import('@/pages/layout.vue'),
    },
    {
        path: '/progress',
        name: routeName.progress,
        meta: {
            label: '进度',
            icon: 'PercentageOutlined',
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            {
                path: '/progress/disassembly',
                name: routeName.progressDisassembly,
                meta: {
                    label: '拆解项目',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/progress/disassembly/progress-disassembly.vue')
            },
            {
                path: '',
                name: routeName.progressStatus,
                meta: {
                    label: '当前情况',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                children: [
                    {
                        path: '/progress/status/table',
                        name: routeName.progressStatusTable,
                        meta: {
                            label: '表格',
                            requireAuth: true,
                            permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                        },
                        component: () => import('@/pages/progress/status/table/progress-status-table.vue'),
                    },
                    {
                        path: '/progress/status/chart',
                        name: routeName.progressStatusChart,
                        meta: {
                            label: '示意图',
                        },
                        component: () => import('@/pages/progress/status/chart/progress-status-chart.vue')
                    },
                ],
            },
            {
                path: '/progress/snapshot',
                name: '历史快照',
                meta: {
                    label: '历史快照',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/progress/historical-snapshot.vue'),
            },
            {
                path: '/progress/warning',
                name: '进度预警',
                meta: {
                    label: '历史快照',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/progress/historical-snapshot.vue'),
            },
            {
                path: '/progress/update_log',
                name: '更新日志',
                meta: {
                    label: '更新日志',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/progress/update-log.vue'),
            },
        ],
    },
    {
        path: '/project',
        name: routeName.project,
        component: () => import('@/pages/layout.vue'),
        meta: {
            label: '项目',
            icon: 'ProfileOutlined',
        },
        children: [
            {
                path: '/project/table',
                name: '项目列表',
                meta: {
                    label: '项目列表',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/project/table/project-table.vue'),
            },
            {
                path: '/project/performance',
                name: '历史业绩',
                meta: {
                    label: '历史业绩',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/project/historical-performance.vue'),
            },
        ],
    },
    {
        path: '/contract',
        name: '合同',
        component: () => import('@/pages/layout.vue'),
        meta: {
            label: '合同',
            icon: 'BookOutlined',
        },
        children: [
            {
                path: '/contract/list',
                name: '合同列表',
                meta: {
                    label: '合同列表',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/contract/table/contract-table.vue')
            },
        ],
    },
    {
        path: '/user-management',
        name: '用户管理',
        meta: {
            label: '用户管理',
            icon: 'UserOutlined',
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            {
                path: '/user-management/organization-structure',
                name: '组织结构',
                meta: {
                    label: '组织结构',
                    requireAuth: true,
                    permittedRoles: ['管理员'],
                },
                component: () => import('@/pages/user-management/organization-structure.vue')
            },
            {
                path: '/project/member',
                name: '成员管理',
                meta: {
                    label: '成员管理',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/project/member-management.vue'),
            },
        ],
    },
    //以下为消息中心
    {
        path: '/',
        name: '消息中心',
        meta: {
            label: '消息中心',
            icon: 'MessageOutlined',
            requireAuth: true,
            permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            {
                path: '/message',
                name: '消息',
                meta: {
                    label: '消息',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/message/index.vue'),
            }
        ],

    },
    {
        path: '/',
        name: '相关方',
        meta: {
            label: '相关方',
            icon: 'ApartmentOutlined',
            requireAuth: true,
            permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            {
                path: '/related-party/list',
                name: '相关方列表',
                meta: {
                    label: '相关方列表',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/related-party/table/related-party-table.vue')
            },
        ],

    },
    {
        path: '/login',
        name: '登录',
        meta: {
            label: '登录',
            hidden: true,
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
            label: '权限不足，无法访问',
            hidden: true,
            requireAuth: false,
        },
        component: () => import('@/pages/403.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        meta: {
            label: '页面不存在',
            hidden: true,
            requireAuth: false,
        },
        component: () => import('@/pages/404.vue'),
    },
    {
        path: '/test1',
        name: '测试1',
        meta: {
            label: '测试1',
            icon: 'AuditOutlined',
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            {
                path: '/test2',
                name: '测试2',
                meta: {
                    label: '测试2',
                },
                component: () => import('@/pages/test.vue')
            },
        ],
    },
    {
        path: '/test3',
        name: '测试3',
        meta: {
            label: '测试3',
            icon: 'AntCloudOutlined',
        },
        component: () => import('@/pages/test.vue')
    },
]

export default routes
