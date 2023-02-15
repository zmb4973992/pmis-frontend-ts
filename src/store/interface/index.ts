//store中所有的接口类型都在这里定义

export interface userState {
    access_token: string,
    username: string,
    full_name: string,
    roles: string[],
    departments: string[],
}

export interface globalState {
    isCollapsed: boolean,
}
