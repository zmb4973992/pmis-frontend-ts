import request from "@/utils/request";

export interface iDepartmentGet {
    id: number
}

export interface iDepartmentCreate {
    name: string
    level_name: string
    superior_id: number
}

export interface iDepartmentUpdate {
    id: number,
    name?: string
    level_name?: string
    superior_id?: number
}

export interface iDepartmentDelete {
    id: number
}

export interface iDepartmentGetArray {
    is_showed_by_role?: boolean
    superior_id?: number
    level_name?: string
    name?: string
    name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

export interface iDepartmentGetList {
    is_showed_by_role?: boolean
    superior_id?: number
    level_name?: string
    name?: string
    name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}


const departmentApi = {
    get: (param: iDepartmentGet) => request.get('/department/' + param.id)
        .then(res => res.data,),
    update: (param: iDepartmentUpdate) => request.patch('/department/' + param.id, param)
        .then(res => res.data,),
    create: (param: iDepartmentCreate) => request.post('/department', param)
        .then(res => res.data,),
    delete: (param:iDepartmentDelete) => request.delete('/department'+param.id)
        .then(res => res.data),
    getArray: (param:iDepartmentGetArray) => request.post('/department/array',param)
        .then(res => res.data),
    getList: (param?:iDepartmentGetList) => request.post('/department/list',param)
        .then(res => res.data),
}

export {departmentApi,}
