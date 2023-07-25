import request from "@/utils/request";

export interface iDisassemblyGet {
    id: number
}

export interface iDisassemblyGetTree {
    project_id: number
}

export interface iDisassemblyCreate {
    name: string
    weight: number
    superior_id: number
}

export interface iDisassemblyCreateInBatches {
    param: iDisassemblyCreate[]
}

export interface iDisassemblyUpdate {
    id: number
    name?: string
    weight?: number
}

export interface iDisassemblyDelete {
    id: number
}

export interface iDisassemblyGetList {
    project_id?: number
    level?: number
    superior_id?: number
    level_gte?: number
    level_lte?: number
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const disassemblyApi = {
    get: (param: iDisassemblyGet) => request.get(
        '/disassembly/' + param.id).then(res => res.data,),
    getTree: (param: iDisassemblyGetTree) => request.post(
        '/disassembly/tree', param).then(res => res.data,),
    create: (param: iDisassemblyCreate) => request.post(
        '/disassembly', param).then(res => res.data,),
    createInBatches: (param: iDisassemblyCreateInBatches) => request.post(
        '/disassembly/batch', param).then(res => res.data,),
    update: (param: iDisassemblyUpdate) => request.patch(
        '/disassembly/' + param.id, param).then(res => res.data,),
    delete: (param: iDisassemblyDelete) => request.delete(
        '/disassembly/' + param.id,).then(res => res.data,),
    getList: (param?: iDisassemblyGetList) => request.post(
        '/disassembly/list', param).then(res => res.data,),
}

export {disassemblyApi,}
