import request from "@/utils/request";

export interface iRelatedPartyGet {
    id: number
}

export interface iRelatedPartyCreate {
    name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
}

export interface iRelatedPartyUpdate {
    id: number
    name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
}

export interface iRelatedPartyDelete {
    id : number
}

export interface iRelatedPartyGetList {
    name_include?: string
    english_name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}


const relatedPartyApi = {
    get: (param: iRelatedPartyGet) => request.get(
        '/related-party/' + param.id).then(res => res.data,),
    update: (param: iRelatedPartyUpdate) => request.patch(
        '/related-party/' + param.id, param).then(res => res.data,),
    create: (param: iRelatedPartyCreate) => request.post(
        '/related-party', param).then(res => res.data,),
    delete: (param:iRelatedPartyDelete) => request.delete(
        '/related-party/' + param.id,).then(res => res.data,),
    getList: (param?: iRelatedPartyGetList) => request.post(
        '/related-party/list', param).then(res => res.data,),
}

export {relatedPartyApi}
