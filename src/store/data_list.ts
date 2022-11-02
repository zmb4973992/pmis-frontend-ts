import {defineStore} from "pinia";
import request from "@/utils/request";
import {userState} from "@/store/interface";
import {GetRelatedPartyList} from "@/api/related_party";

export interface dataList {
    id_gte?:number
    id_lte?:number
    chinese_name_include?:string
    page?:number
    page_size?:number
    order_by?:string
    desc?:boolean
    id?:number
    chinese_name?:string

}

//用来储存用户信息
const useDataListStore = defineStore(
    'data_list',
    {
        state: () => ({
            data: [],
            current_page: 1,
            total_pages: 1,
            total_records: 0,
        }),
        actions: {
            update_data_list(params:dataList) {
                GetRelatedPartyList(params).then(

                )
            }
        }
    })

export default useDataListStore
