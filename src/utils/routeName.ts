//用于route的name属性，必须唯一，不能重复
export enum routeName {
    homePage = '首页',
    progress = '进度',
    progressDisassembly = '拆解项目',
    progressDisassemblyWithParam = '拆解项目(带param)',
    progressStatus = '当前情况',
    progressStatusTable = '当前情况(表格)',
    progressStatusChart = '当前情况(图表)',

    project = '项目',
    projectTable = '项目列表',
}

export enum localStorageItemName {
    projectIDForDisassembly = 'project-id-for-disassembly'
}
