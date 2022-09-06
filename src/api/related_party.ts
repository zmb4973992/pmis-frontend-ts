import request from "@/util/axios";

//接口只能一次性导出，不能先定义、再导出
export interface IRelatedParty {
    chinese_name: string
    english_name: string
    address: string
    uniform_social_credit_code: string
    telephone: string
}

const GetRelatedParty = (relatedPartyID: number) => request.get(
    '/api/related_party/' + relatedPartyID
)

const UpdateRelatedParty = (relatedPartyID: number, param: IRelatedParty) => request.put(
    '/api/related_party/' + relatedPartyID,
    param,
)

const CreateRelatedParty = (param: IRelatedParty) => request.post(
    '/api/related_party',
    param
)

const DeleteRelatedParty = (relatedPartyID: number) => request.delete(
    '/api/related_party/' + relatedPartyID,
)

export {GetRelatedParty, UpdateRelatedParty, CreateRelatedParty, DeleteRelatedParty}
