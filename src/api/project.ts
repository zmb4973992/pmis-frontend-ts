import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface projectGet {
    id: number
}

interface projectCreate {
    code?: string
    name?: string
    country?: number
    province?: number
    type?: number
    amount?: number
    currency?: number
    exchange_rate?: number
    organization_id?: number
    related_party_id?: number
    status?: number
    signing_date?: string
    effective_date?: string
    our_signatory?: number
    construction_period?: number
    content?: string
}

interface projectUpdate {
    id: number
    code?: string
    name?: string
    country?: number | null
    province?: number | null
    type?: number | null
    amount?: number | null
    currency?: number | null
    exchange_rate?: number
    organization_id?: number | null
    related_party_id?: number | null
    status?: number | null
    signing_date?: string
    effective_date?: string
    our_signatory?: number | null
    construction_period?: number | null
    content?: string
}

interface projectDelete {
    id: number
}

interface projectGetList extends list {
    name_include?: string
    organization_id_in?: number[]
    organization_name_include?: string
    related_party_id?: number
    country?:number
    approval_date_gte?: string
    approval_date_lte?: string
    status?: number
    type?: number
    ignore_data_authority?: boolean
}

interface projectGetSimplifiedList {
    ignore_data_authority?: boolean
}

interface projectGetCount {
    approval_date_gte?:string,
    approval_date_lte?:string,
}

const projectApi = {
    get: (param: projectGet) => request.get('/project/' + param.id)
        .then(res => res.data),
    create: (param: projectCreate) => request.post('/project', param)
        .then(res => res.data,),
    update: (param: projectUpdate) => request.patch('/project/' + param.id, param)
        .then(res => res.data),
    delete: (param: projectDelete) => request.delete('/project/' + param.id)
        .then(res => res.data,),
    getList: (param?: projectGetList) => request.post('/project/list', param)
        .then(res => res.data),
    getSimplifiedList: (param?: projectGetSimplifiedList) => request.post('/project/simplified-list', param)
        .then(res => res.data),
    getCount: (param?: projectGetCount) => request.post('/project/count', param)
        .then(res => res.data),
}

export {projectApi,}
