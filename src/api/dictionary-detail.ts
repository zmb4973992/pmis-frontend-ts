import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface dictionaryDetailGetList extends list {
    dictionary_type_name?: string
    name?:string
}

const dictionaryDetailApi = {
    getList: (param?: dictionaryDetailGetList) => request.post(
        '/dictionary-detail/list', param).then(res => res.data)
}

export {dictionaryDetailApi}
