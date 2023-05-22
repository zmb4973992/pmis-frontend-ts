import request from "@/utils/request";

export interface iDictionaryItemGetList {
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
    dictionary_type_id?: number
    dictionary_type_name?:string
}

const dictionaryItemApi = {
    getList: (param?: iDictionaryItemGetList) => request.post(
        '/dictionary-item/list', param).then(res=>res.data)
}

export {dictionaryItemApi}
