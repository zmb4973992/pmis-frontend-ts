import {menu} from "@/components/interface";

const menuList: menu[] = [
    {
        path: '/progress',
        label: '进度',
        icon: 'PlayCircleOutlined',
        children: [
            {
                path: '/disassembly',
                label: '拆解项目',
            },
            {
                path: '/list',
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
        icon: 'DownOutlined',
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
        path: '/contract',
        label: '合同',
        icon: 'FileTextOutlined',
        children: [
            {
                path: '/list',
                label: '合同列表',
            },
        ],
    },
    {
        path: '/related-party',
        label: '相关方',
        icon: 'UpOutlined',
        children: [
            {
                path: '/list',
                label: '相关方列表',
            },
        ],
    },
    {
        path: '/message',
        label: '消息中心',
        icon: 'UpOutlined',
    },
    {
        path: '/user_management',
        label: '用户管理',
        icon: 'MessageOutlined',
        children: [
            {
                path: '/organization_structure',
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
