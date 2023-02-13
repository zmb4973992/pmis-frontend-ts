import request from "@/utils/request";

export interface projectGet {
    id :number
}

export interface projectCreate {
    project_code?: string
    project_full_name?: string
    project_short_name?: string
    country?: string
    province?: string
    project_type?: string
    amount?: number
    currency?: string
    exchange_rate?: number
    department_id?: number
    related_party_id?: number
}

export interface projectUpdate {
    id:number
    project_code?: string
    project_full_name?: string
    project_short_name?: string
    country?: string
    province?: string
    project_type?: string
    amount?: number|null
    currency?: string
    exchange_rate?: number|null
    department_id?: number|null
    related_party_id?: number|null
    project_status?:string
    signing_date?:string
}

export interface projectDelete {
    id:number
}

export interface projectGetList {
    is_showed_by_role?:boolean
    project_name_include?: string
    department_id_in?: number[]
    department_name_include?:string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

export interface projectGetArray {
    is_showed_by_role?:boolean
    project_name_like?: string
    department_id_in?: number[]
    department_name_include?:string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const projectApi = {
    get:(param:projectGet)=> request.get('/api/project/' + param.id)
        .then(res => res.data),
    create:(param:projectCreate)=> request.post('/api/project', param)
        .then(res => res.data,),
    update:(param:projectUpdate) => request.patch('/api/project',param)
        .then(res => res.data),
    delete: (param:projectDelete) => request.delete('/api/project/' + param.id)
        .then(res => res.data,),
    getList:(param?:projectGetList) => request.post('/api/project/list',param)
        .then(res=>res.data),
    getArray:(param?:projectGetArray) => request.post('/api/project/array',param)
        .then(res=>res.data),
}

export {projectApi,}
