import request from "@/utils/request";

export interface iProgressGet {
    id: number
}

export interface iProgressCreate {
    disassembly_id: number
    date: string
    type: number
    value: number
    remark?: string
}

export interface iProgressUpdate {
    id: number

    date?: string
    value?: number  //如果不行，可以加null试试
    remark?: string
}

export interface iProgressDelete {
    id: number
}

export interface iProgressGetList {
    disassembly_id: number
    date_gte?: string
    date_lte?: string
    type_in?: number[]
    value_gte?:number
    value_lte?:number
    data_source?:number

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const progressApi = {
    get: (param: iProgressGet) => request.get('/api/progress/' + param.id)
        .then(res => res.data),
    create: (param: iProgressCreate) => request.post('/api/progress', param)
        .then(res => res.data,),
    update: (param: iProgressUpdate) => request.patch('/api/progress/' + param.id, param)
        .then(res => res.data),
    delete: (param: iProgressDelete) => request.delete('/api/progress/' + param.id)
        .then(res => res.data,),
    getList: (param?: iProgressGetList) => request.post('/api/progress/list', param)
        .then(res => res.data),
}

export {progressApi,}
