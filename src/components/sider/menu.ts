import {menu} from "@/components/interface";

const menuList: menu[] = [
    {
        path: '/progress',
        label: '进度',
        children: [
            {
                path: '/disassembly',
                label: '拆解项目',
            },
            {
                path: '/status',
                label: '当前情况',
            },
            {
                path: '/snapshot',
                label: '历史快照',
            },
            {
                path: '/warning',
                label: '进度预警',
            },
            {
                path: '/update_log',
                label: '更新日志',
            },
        ],
    },
    {
        path: '/project',
        label: '项目',
        children: [
            {
                path: '/list',
                label: '项目列表',
            },
            {
                path: '/performance',
                label: '历史业绩',
            },
            {
                path: '/member',
                label: '成员管理',
            },
        ],
    },
    {
        path: '/related-party',
        label: '相关方',
        children: [
            {
                path: '/list',
                label: '相关方列表',
            },
        ],
    },
    {
        path: '/related-party',
        label: '重复测试1',
        children: [
            {
                path: '/list',
                label: '重复测试1',
            },
        ],
    },
    {
        path: '/related-party',
        label: '重复测试2',
        children: [
            {
                path: '/list',
                label: '重复测试2',
            },
        ],
    },
    {
        path: '/related-party',
        label: '重复测试3',
        children: [
            {
                path: '/list',
                label: '重复测试3',
            },
        ],
    },
    {
        path: '/related-party',
        label: '重复测试4',
        children: [
            {
                path: '/list',
                label: '重复测试4',
            },
        ],
    },
    {
        path: '/',
        label: '重复测试5',
    },
    {
        path: '/related-party',
        label: '重复测试6',
        children: [
            {
                path: '/list',
                label: '重复测试6',
            },
        ],
    },
    {
        path: '/related-party',
        label: '重复测试7',
        children: [
            {
                path: '/list',
                label: '重复测试7',
            },
        ],
    },
    {
        path: '/related-party',
        label: '重复测试8',
        children: [
            {
                path: '/list',
                label: '重复测试8',
            },
        ],
    },
]

export {menuList}
