import request from "@/utils/request";

export interface disassemblyGet {
    id: number
}

export interface disassemblyGetTree {
    project_id: number
}

export interface disassemblyCreate {
    name: string
    project_id: number
    level: number
    weight: number
    superior_id: number
}

export interface disassemblyCreateInBatches {
    param: disassemblyCreate[]
}

export interface disassemblyUpdate {
    id :number
    name?: string
    project_id?: number
    level?: number
    weight?: number
    superior_id?: number
}

export interface disassemblyDelete {
    id :number
}

export interface disassemblyDeleteWithSubitems {
    id :number
}

export interface disassemblyGetList {
    project_id?: number
    level?: number
    superior_id?: number
    level_gte?:number
    level_lte?:number
    page?:number
    page_size?:number
    order_by?:string
    desc?:boolean
}

const disassemblyApi = {
    get: (param:disassemblyGet) => request.get(
        '/api/disassembly/' + param.id).then(res => res.data,),
    getTree: (param:disassemblyGetTree) => request.post(
        '/api/disassembly/tree', param).then(res => res.data,),
    create: (param: disassemblyCreate) => request.post(
        '/api/disassembly', param).then(res => res.data,),
    createInBatches: (param: disassemblyCreateInBatches) => request.post(
        '/api/disassembly/batch', param).then(res => res.data,),
    update: ( param: disassemblyUpdate) => request.patch(
        '/api/disassembly/' + param.id, param).then(res => res.data,),
    delete: (param:disassemblyDelete) => request.delete(
        '/api/disassembly/' + param.id,).then(res => res.data,),
    deleteWithSubitems: (param:disassemblyDeleteWithSubitems) =>
        request.delete('/api/disassembly/with-subitems/' + param.id,)
            .then(res => res.data,),
    getList: (param:disassemblyGetList) => request.post(
        '/api/disassembly/list', param).then(res => res.data,),
}

export {disassemblyApi,}
