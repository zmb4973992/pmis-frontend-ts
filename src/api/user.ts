import request from "@/utils/request";

interface userGet {
    id: number
}

interface userCreate {
    username: string
    password: string
    full_name?: string
    email_address?: string
    is_valid?: boolean
    mobile_phone_number?: string
    employee_number?: string
}

interface userUpdate {
    id: number
    full_name?: string
    email_address?: string
    is_valid?: boolean
    mobile_phone_number?: string
    employee_number?: string
}

interface userDelete {
    id: number
}

interface userGetList {
    is_valid?: boolean
    username_include?: string
    role_id?: number
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

interface userAdjustRoles {
    id: number
    role_ids: number[]
}

const userApi = {
    get: (param: userGet) => request.get('/user/' + param.id)
        .then(res => res.data),
    create: (param: userCreate) => request.post('/user', param)
        .then(res => res.data,),
    update: (param: userUpdate) => request.patch('/user/' + param.id, param)
        .then(res => res.data),
    delete: (param: userDelete) => request.delete('/user/' + param.id)
        .then(res => res.data,),
    getList: (param?: userGetList) => request.post('/user/list', param)
        .then(res => res.data),
    adjustRoles: (param: userAdjustRoles) => request.post('/user/' + param.id + '/roles')
        .then(res => res.data),
}

export {userApi,}




