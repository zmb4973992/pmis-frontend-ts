import {menuFormat} from "@/components/interface/menu";

const menuList: menuFormat[] = [
    {
        label: '进度',
        icon: 'PlayCircleOutlined',
        children: [
            {
                label: '拆解项目',
                path: '/progress/disassembly',
            },
            {
                label: '当前情况',
                children: [
                    {
                        label: '列表',
                        path: '/progress/list',
                    },
                    {
                        label: '示意图',
                        path: '/progress/chart',
                    },
                ],
            },
            {
                label: '历史快照',
                path: '/progress/snapshot',
            },
            {
                label: '进度预警',
                path: '/progress/warning',
            },
            {
                label: '更新日志',
                path: '/progress/update_log',
            },
        ],
    },
    {
        label: '项目',
        icon: 'DownOutlined',
        children: [
            {
                label: '项目列表',
                path: '/project/list',
            },
            {
                label: '历史业绩',
                path: '/project/performance',
            },
            {
                label: '成员管理',
                path: '/project/member',
            },
        ],
    },
    {
        label: '合同',
        icon: 'FileTextOutlined',
        children: [
            {
                label: '合同列表',
                path: '/contract/list',
            },
        ],
    },
    {
        label: '相关方',
        icon: 'UpOutlined',
        children: [
            {
                label: '相关方列表',
                path: '/related-party/list',
            },
        ],
    },
    {
        label: '消息中心',
        path: '/message',
        icon: 'UpOutlined',
    },
    {
        label: '用户管理',
        icon: 'MessageOutlined',
        children: [
            {
                label: '组织结构',
                path: '/user-management/organization-structure',
            },
        ],
    },
    {
        label: '测试',
        path: '/test',
        icon: 'QuestionCircleOutlined'
    },
]

export {menuList}
