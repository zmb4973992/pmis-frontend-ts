import request from "@/utils/request";

export interface iProjectGet {
    id: number
}

export interface iProjectCreate {
    code?: string
    name?: string
    country?: number
    province?: number
    type?: number
    amount?: number
    currency?: number
    exchange_rate?: number
    department_id?: number
    related_party_id?: number
    status?: number
    signing_date?: string
    effective_date?: string
    our_signatory?: number
    construction_period?: number
    content?: string
}

export interface iProjectUpdate {
    id: number
    code?: string
    name?: string
    country?: number | null
    province?: number | null
    type?: number | null
    amount?: number | null
    currency?: number | null
    exchange_rate?: number | null
    department_id?: number | null
    related_party_id?: number | null
    status?: number | null
    signing_date?: string
    effective_date?: string
    our_signatory?: number | null
    construction_period?: number | null
    content?: string
}

export interface iProjectDelete {
    id: number
}

export interface iProjectGetList {
    is_showed_by_role?: boolean
    name_include?: string
    department_id_in?: number[]
    department_name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

export interface iProjectGetArray {
    is_showed_by_role?: boolean
    name_like?: string
    department_id_in?: number[]
    department_name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const projectApi = {
    get: (param: iProjectGet) => request.get('/api/project/' + param.id)
        .then(res => res.data),
    create: (param: iProjectCreate) => request.post('/api/project', param)
        .then(res => res.data,),
    update: (param: iProjectUpdate) => request.patch('/api/project/' + param.id, param)
        .then(res => res.data),
    delete: (param: iProjectDelete) => request.delete('/api/project/' + param.id)
        .then(res => res.data,),
    getList: (param?: iProjectGetList) => request.post('/api/project/list', param)
        .then(res => res.data),
    getArray: (param?: iProjectGetArray) => request.post('/api/project/array', param)
        .then(res => res.data),
}

export {projectApi,}
