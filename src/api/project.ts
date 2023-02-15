import request from "@/utils/request";
import dayjs from "dayjs";

export interface iProjectGet {
    id :number
}

export interface iProjectCreate {
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
    our_signatory?:string
}

export interface iProjectUpdate {
    id:number
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
    project_status?:string
    signing_date?:string
    our_signatory?:string
    duration?:number
}

export interface iProjectDelete {
    id:number
}

export interface iProjectGetList {
    is_showed_by_role?:boolean
    project_name_include?: string
    department_id_in?: number[]
    department_name_include?:string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

export interface iProjectGetArray {
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
    get:(param:iProjectGet)=> request.get('/api/project/' + param.id)
        .then(res => res.data),
    create:(param:iProjectCreate)=> request.post('/api/project', param)
        .then(res => res.data,),
    update:(param:iProjectUpdate) => request.patch('/api/project/'+param.id,param)
        .then(res => res.data),
    delete: (param:iProjectDelete) => request.delete('/api/project/' + param.id)
        .then(res => res.data,),
    getList:(param?:iProjectGetList) => request.post('/api/project/list',param)
        .then(res=>res.data),
    getArray:(param?:iProjectGetArray) => request.post('/api/project/array',param)
        .then(res=>res.data),
}

export {projectApi,}
