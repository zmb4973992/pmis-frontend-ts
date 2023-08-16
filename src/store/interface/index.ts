//store中所有的接口类型都在这里定义

export interface userState {
    accessToken: string,
    userID:number,
    username: string,
    fullName: string,
    roles: string[],
    departments: string[],
}

export interface globalState {
    isCollapsed: boolean,
}
