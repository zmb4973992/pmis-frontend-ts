import request from "@/utils/request";

//接口只能一次性导出，不能先定义、再导出
export interface IRelatedParty {
    chinese_name: string
    english_name: string
    address: string
    uniform_social_credit_code: string
    telephone: string
}

export interface IRelatedPartyList {
    id_gte?: number
    id_lte?: number
    chinese_name_include?: string
    english_name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const GetRelatedParty = (relatedPartyID: number) => request.get(
    '/api/related_party/' + relatedPartyID
).then(res => res.data,)

const UpdateRelatedParty = (relatedPartyID: number, param: IRelatedParty) => request.put(
    '/api/related_party/' + relatedPartyID, param).then(res => res.data,)

const CreateRelatedParty = (param: IRelatedParty) => request.post(
    '/api/related_party', param).then(res => res.data,)


const DeleteRelatedParty = (relatedPartyID: number) => request.delete(
    '/api/related_party/' + relatedPartyID,).then(res => res.data,)

const GetRelatedPartyList = (paramIn?: IRelatedPartyList) => {
    const paramOut: IRelatedPartyList = {}
    if (paramIn) {
        if (paramIn.chinese_name_include) {
            paramOut.chinese_name_include = paramIn.chinese_name_include
        }
        if (paramIn.english_name_include) {
            paramOut.english_name_include = paramIn.english_name_include
        }
        if (paramIn.page) {
            paramOut.page = paramIn.page
        }
        if (paramIn.page_size) {
            paramOut.page_size = paramIn.page_size
        }
    }
    return request.post('/api/related_party/list', paramOut)
        .then(res => res.data,)
}

export {
    GetRelatedParty,
    UpdateRelatedParty,
    CreateRelatedParty,
    DeleteRelatedParty,
    GetRelatedPartyList
}
