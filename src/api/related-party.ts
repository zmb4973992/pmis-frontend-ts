import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface relatedPartyGet {
    id: number
}

interface relatedPartyCreate {
    name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
    remarks?: string
    file_ids?: string
}

interface relatedPartyUpdate {
    id: number
    name?: string
    english_name?: string
    address?: string
    uniform_social_credit_code?: string
    telephone?: string
    remarks?: string
    file_ids?:string
}

interface relatedPartyDelete {
    id: number
}

interface relatedPartyGetList extends list {
    name_include?: string
    english_name_include?: string
}


const relatedPartyApi = {
    get: (param: relatedPartyGet) => request.get(
        '/related-party/' + param.id).then(res => res.data,),
    update: (param: relatedPartyUpdate) => request.patch(
        '/related-party/' + param.id, param).then(res => res.data,),
    create: (param: relatedPartyCreate) => request.post(
        '/related-party', param).then(res => res.data,),
    delete: (param: relatedPartyDelete) => request.delete(
        '/related-party/' + param.id,).then(res => res.data,),
    getList: (param?: relatedPartyGetList) => request.post(
        '/related-party/list', param).then(res => res.data,),
}

export {relatedPartyApi}
