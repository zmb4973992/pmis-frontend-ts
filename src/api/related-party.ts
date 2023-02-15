import request from "@/utils/request";

export interface iRelatedPartyGet {
    id: number
}

export interface iRelatedPartyCreate {
    chinese_name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
}

export interface iRelatedPartyUpdate {
    id: number
    chinese_name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
}

export interface iRelatedPartyDelete {
    id : number
}

export interface iRelatedPartyGetList {
    chinese_name_include?: string
    english_name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}


const relatedPartyApi = {
    get: (param: iRelatedPartyGet) => request.get(
        '/api/related-party/' + param.id).then(res => res.data,),
    update: (param: iRelatedPartyUpdate) => request.patch(
        '/api/related-party/' + param.id, param).then(res => res.data,),
    create: (param: iRelatedPartyCreate) => request.post(
        '/api/related-party', param).then(res => res.data,),
    delete: (param:iRelatedPartyDelete) => request.delete(
        '/api/related-party/' + param.id,).then(res => res.data,),
    getList: (param?: iRelatedPartyGetList) => request.post(
        '/api/related-party/list', param).then(res => res.data,),
}

export {relatedPartyApi}
