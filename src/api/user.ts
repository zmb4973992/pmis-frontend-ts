import request from "@/util/axios";

//接口只能一次性导出，不能先定义、再导出
export interface IUpdateUser {
    full_name: string
    email_address: string
    is_valid: boolean
    mobile_phone_number: string
    employee_number: string
}

export interface IUserList {
    id_gte?: number
    id_lte?: number
    is_valid?: boolean
    username_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

export interface ICreateUser extends IUpdateUser {
    username: string
    password: string
}

const GetUser = () => request.get(
    '/api/user'
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const GetUserByID = (userID: number) => request.get(
    '/api/user/' + userID
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const UpdateUser = (userID: number, param: IUpdateUser) => request.put(
    '/api/user/' + userID,
    param,
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const CreateUser = (param: ICreateUser) => request.post(
    '/api/user',
    param
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const DeleteUser = (userID: number) => request.delete(
    '/api/user/' + userID,
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const GetUserList = (params: IUserList) => request.get(
    '/api/user/list',
    {params}
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)


export {
    GetUserByID,
    UpdateUser,
    CreateUser,
    DeleteUser,
    GetUserList,

    GetUser,
}



