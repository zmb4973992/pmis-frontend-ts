import {menuFormat} from "@/components/interface/menu";

const menuList: menuFormat[] = [
    {
        path: '/progress',
        label: '进度',
        icon: 'PlayCircleOutlined',
        children: [
            {
                path: '/progress/disassembly',
                label: '拆解项目',
            },
            {
                path: '/progress/list',
                label: '当前情况（表格）',
            },
            {
                path: '/progress/chart',
                label:'当前情况（示意图）',
            },
            {
                path: '/progress/snapshot',
                label: '历史快照',
            },
            {
                path: '/progress/warning',
                label: '进度预警',
            },
            {
                path: '/progress/update_log',
                label: '更新日志',
            },
        ],
    },
    {
        path: '/project',
        label: '项目',
        icon: 'DownOutlined',
        children: [
            {
                path: '/project/list',
                label: '项目列表',
            },
            {
                path: '/project/performance',
                label: '历史业绩',
            },
            {
                path: '/project/member',
                label: '成员管理',
            },
        ],
    },
    {
        path: '/project/contract',
        label: '合同',
        icon: 'FileTextOutlined',
        children: [
            {
                path: '/project/list',
                label: '合同列表',
            },
        ],
    },
    {
        path: '/project/related-party',
        label: '相关方',
        icon: 'UpOutlined',
        children: [
            {
                path: '/project/list',
                label: '相关方列表',
            },
        ],
    },
    {
        path: '/project/message',
        label: '消息中心',
        icon: 'UpOutlined',
    },
    {
        path: '/project/user_management',
        label: '用户管理',
        icon: 'MessageOutlined',
        children: [
            {
                path: '/project/organization_structure',
                label: '组织结构',
            },
        ],
    },
    {
        path: '/test',
        label: '测试',
        icon: 'QuestionCircleOutlined'
    },
]

export {menuList}
