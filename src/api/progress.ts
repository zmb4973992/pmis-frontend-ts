import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface progressGet {
    id: number
}

interface progressCreate {
    disassembly_id: number
    date: string
    type: number
    value: number
    remarks?: string
}

interface progressUpdate {
    id: number

    date?: string
    type?:number
    value?: number
    remarks?: string
}

interface progressDelete {
    id: number
}

interface progressGetList extends list {
    project_id?:number
    disassembly_id?: number
    date_gte?: string
    date_lte?: string
    type?:number
    type_name?:string
    data_source?:number
}

const progressApi = {
    get: (param: progressGet) => request.get('/progress/' + param.id)
        .then(res => res.data),
    create: (param: progressCreate) => request.post('/progress', param)
        .then(res => res.data,),
    update: (param: progressUpdate) => request.patch('/progress/' + param.id, param)
        .then(res => res.data),
    delete: (param: progressDelete) => request.delete('/progress/' + param.id)
        .then(res => res.data,),
    getList: (param?: progressGetList) => request.post('/progress/list', param)
        .then(res => res.data),
}

export {progressApi,}
