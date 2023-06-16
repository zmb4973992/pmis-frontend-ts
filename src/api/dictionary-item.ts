import request from "@/utils/request";

export interface iDictionaryDetailGetList {
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
    dictionary_type_id?: number
    dictionary_type_name?:string
}

const dictionaryDetailApi = {
    getList: (param?: iDictionaryDetailGetList) => request.post(
        '/dictionary-detail/list', param).then(res=>res.data)
}

export {dictionaryDetailApi}
