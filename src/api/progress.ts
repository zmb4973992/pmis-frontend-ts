import request from "@/utils/request";

export interface iProgressGet {
    id: number
}

export interface iProgressCreate {
    disassembly_id: number
    date: string
    type: number
    value: number
    remarks?: string
}

export interface iProgressUpdate {
    id: number

    date?: string
    type?:number
    value?: number
    remarks?: string
}

export interface iProgressDelete {
    id: number
}

export interface iProgressGetList {
    project_id?:number
    disassembly_id?: number
    date_gte?: string
    date_lte?: string
    type?:number
    type_name?:string
    data_source?:number

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const progressApi = {
    get: (param: iProgressGet) => request.get('/progress/' + param.id)
        .then(res => res.data),
    create: (param: iProgressCreate) => request.post('/progress', param)
        .then(res => res.data,),
    update: (param: iProgressUpdate) => request.patch('/progress/' + param.id, param)
        .then(res => res.data),
    delete: (param: iProgressDelete) => request.delete('/progress/' + param.id)
        .then(res => res.data,),
    getList: (param?: iProgressGetList) => request.post('/progress/list', param)
        .then(res => res.data),
}

export {progressApi,}
