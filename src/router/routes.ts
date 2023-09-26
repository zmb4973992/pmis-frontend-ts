//这里的变量名之所以为routes，是为了下面的router能直接使用这个名称，这是es6简写原则
import {RouteRecordRaw} from "vue-router";
import {routeName} from "@/utils/routeName";

//把route的meta限定的更细致一些，便于引用和类型判定
export type customRouteRecord = RouteRecordRaw & {
    meta?: {
        label?: string, //标签、显示名称
        icon?: string, //图标
        hidden?: boolean, //是否在目录中隐藏
    }
    children?: customRouteRecord[]
}

const privateRoutes: customRouteRecord[] = []


const routes: customRouteRecord[] = [
    {
        path:'',
        name:'首页',
        redirect:'/dashboard',
        meta:{
            hidden:true,
        },
    },
    {
        path: '/42342343434',
        name: '仪表盘',
        meta: {
            label: '仪表盘',
            icon: 'HomeOutlined',
            requireAuth: true,
            permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
        },
        component: () => import('@/pages/layout.vue'),
        children:[
            {
                path: '/dashboard',
                name: '看板',
                meta: {
                    label: '看板',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/dashboard/dashboard.vue'),
            },
        ]
    },
    {
        path: '/545454',
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
                component: () => import('@/pages/project/historical-performance/historical-performance.vue'),
            },
            {
                path:'/project/detail/:projectID',
                name:'项目详情',
                meta:{
                    label:'项目详情',
                    hidden:true,
                },
                component:()=>import('@/pages/project/detail/project-detail.vue')
            },
        ],
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
                path: '、progress/status',
                name: routeName.progressStatus,
                meta: {
                    label: '进度情况',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                children: [
                    {
                        path: '/progress/status/table',
                        name: routeName.progressStatusTable,
                        meta: {
                            label: '详情(编辑)',
                            requireAuth: true,
                            permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                        },
                        component: () => import('@/pages/progress/status/table/progress-status-table.vue'),
                    },
                    {
                        path: '/progress/status/chart',
                        name: routeName.progressStatusChart,
                        meta: {
                            label: '示意图(查看)',
                        },
                        component: () => import('@/pages/progress/status/chart/progress-status-chart.vue')
                    },
                ],
            },
            {
                path: '/progress/update_log',
                name: '更新日志',
                meta: {
                    label: '更新日志',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/progress/update-log/update-log-table.vue'),
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
            {
                path: '/contract/detail/:contractID',
                name: '合同详情',
                meta: {
                    hidden:true,
                    label: '合同详情',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/contract/detail/contract-detail.vue')
            },
        ],
    },
    // {
    //     path: '/user-management',
    //     name: '用户管理',
    //     meta: {
    //         label: '用户管理',
    //         icon: 'UserOutlined',
    //     },
    //     component: () => import('@/pages/layout.vue'),
    //     children: [
    //         {
    //             path: '/user-management/organization-structure',
    //             name: '组织结构',
    //             meta: {
    //                 label: '组织结构',
    //                 requireAuth: true,
    //                 permittedRoles: ['管理员'],
    //             },
    //             component: () => import('@/pages/user-management/organization-structure.vue')
    //         },
    //         {
    //             path: '/project/member',
    //             name: '成员管理',
    //             meta: {
    //                 label: '成员管理',
    //                 requireAuth: true,
    //                 permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
    //             },
    //             component: () => import('@/pages/project/member-management.vue'),
    //         },
    //     ],
    // },
    {
        path: '/related-party',
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
            {
                path: '/related-party/detail/:relatedPartyID',
                name: '相关方详情',
                meta: {
                    hidden:true,
                    label: '相关方详情',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/related-party/detail/related-party-detail.vue')
            },
        ],

    },
    {
        path: '/finance',
        name: '财务',
        meta: {
            label: '财务',
            requireAuth: true,
            icon: 'MoneyCollectOutlined',
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            {
                path: '/finance/income',
                name: '收款',
                meta: {
                    label: '收款',
                },
                children: [
                    {
                        path: '/finance/income/actual',
                        name: '实际收款列表',
                        meta: {
                            label: '实际收款',
                        },
                        component: () => import('@/pages/finance/income/actual/actual-income.vue')
                    },
                    {
                        path: '/finance/income/forecast',
                        name: '预测收款列表',
                        meta: {
                            label: '预测收款',
                        },
                        component: () => import('@/pages/finance/income/forecast/forecast-income.vue')
                    },
                ]
            },
            {
                path: '/finance/expenditure',
                name: '付款',
                meta: {
                    label: '付款',
                },
                children: [
                    {
                        path: '/finance/expenditure/actual',
                        name: '实际付款列表',
                        meta: {
                            label: '实际付款',
                        },
                        component: () => import('@/pages/finance/expenditure/actual/actual-expenditure.vue')
                    },
                    {
                        path: '/finance/expenditure/forecast',
                        name: '预测付款列表',
                        meta: {
                            label: '预测付款',
                        },
                        component: () => import('@/pages/finance/expenditure/forecast/forecast-expenditure.vue')
                    },
                ]
            },
        ],
    },
    //以下为消息中心
    {
        path: '/asd',
        name: '消息',
        meta: {
            label: '消息',
            icon: 'MessageOutlined',
            requireAuth: true,
            permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
        },
        component: () => import('@/pages/layout.vue'),
        children: [
            {
                path: '/message',
                name: '消息中心',
                meta: {
                    label: '消息中心',
                    requireAuth: true,
                    permittedRoles: ['管理员', '公司级', '事业部级', '部门级', '项目级'],
                },
                component: () => import('@/pages/message/message-table.vue'),
            }
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
]

export default routes
export {privateRoutes,}
