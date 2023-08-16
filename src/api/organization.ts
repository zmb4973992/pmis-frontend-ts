import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface organizationGet {
    id: number
}

interface organizationCreate {
    name: string
    level_name: string
    superior_id: number
}

interface organizationUpdate {
    id: number,
    name?: string
    level_name?: string
    superior_id?: number
}

interface organizationDelete {
    id: number
}

interface organizationGetList extends list{
    superior_id?: number
    name?: string
    is_valid?:boolean
    name_include?: string
}


const organizationApi = {
    get: (param: organizationGet) => request.get('/organization/' + param.id)
        .then(res => res.data,),
    update: (param: organizationUpdate) => request.patch('/organization/' + param.id, param)
        .then(res => res.data,),
    create: (param: organizationCreate) => request.post('/organization', param)
        .then(res => res.data,),
    delete: (param: organizationDelete) => request.delete('/organization' + param.id)
        .then(res => res.data),
    getList: (param?: organizationGetList) => request.post('/organization/list', param)
        .then(res => res.data),
}

export {organizationApi,}
