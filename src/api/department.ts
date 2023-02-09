import request from "@/utils/request";

//接口只能一次性导出，不能先定义、再导出
export interface departmentGet {
    id: number
}

export interface departmentCreate {
    name: string
    level_name: string
    superior_id: number
}

export interface departmentUpdate {
    id: number,
    name?: string
    level_name?: string
    superior_id?: number
}

export interface departmentDelete {
    id: number
}

export interface departmentGetArray {
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

export interface departmentGetList {
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
    get: (param: departmentGet) => request.get('/api/department/' + param.id)
        .then(res => res.data,),
    update: (param: departmentUpdate) => request.patch('/api/department/' + param.id, param)
        .then(res => res.data,),
    create: (param: departmentCreate) => request.post('/api/department', param)
        .then(res => res.data,),
    delete: (param:departmentDelete) => request.delete('/api/department'+param.id)
        .then(res => res.data),
    getArray: (param:departmentGetArray) => request.post('/api/department/array',param)
        .then(res => res.data),
    getList: (param?:departmentGetList) => request.post('/api/department/list',param)
        .then(res => res.data),
}

export {departmentApi,}
