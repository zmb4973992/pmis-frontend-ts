import request from "@/utils/request";

export interface relatedPartyGet {
    id: number
}

export interface relatedPartyCreate {
    chinese_name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
}

export interface relatedPartyUpdate {
    id: number
    chinese_name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
}

export interface relatedPartyDelete {
    id : number
}

export interface relatedPartyGetList {
    chinese_name_include?: string
    english_name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}


const relatedPartyApi = {
    get: (param: relatedPartyGet) => request.get(
        '/api/related-party/' + param.id).then(res => res.data,),
    update: (param: relatedPartyUpdate) => request.patch(
        '/api/related-party/' + param.id, param).then(res => res.data,),
    create: (param: relatedPartyCreate) => request.post(
        '/api/related-party', param).then(res => res.data,),
    delete: (param:relatedPartyDelete) => request.delete(
        '/api/related-party/' + param.id,).then(res => res.data,),
    getList: (param?: relatedPartyGetList) => request.post(
        '/api/related-party/list', param).then(res => res.data,),
}

export {relatedPartyApi}
