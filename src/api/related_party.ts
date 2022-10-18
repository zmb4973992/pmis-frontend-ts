import request from "@/util/axios";
import internal from "stream";

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
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const GetRelatedParty = (relatedPartyID: number) => request.get(
    '/api/related_party/' + relatedPartyID
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const UpdateRelatedParty = (relatedPartyID: number, param: IRelatedParty) => request.put(
    '/api/related_party/' + relatedPartyID,
    param,
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const CreateRelatedParty = (param: IRelatedParty) => request.post(
    '/api/related_party',
    param
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const DeleteRelatedParty = (relatedPartyID: number) => request.delete(
    '/api/related_party/' + relatedPartyID,
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const GetRelatedPartyList = (params?: IRelatedPartyList) => request.get(
    '/api/related_party/list',
    {params}
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

export {
    GetRelatedParty,
    UpdateRelatedParty,
    CreateRelatedParty,
    DeleteRelatedParty,
    GetRelatedPartyList
}
