import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface disassemblyGet {
    id: number
}

interface disassemblyGetTree {
    project_id: number
}

interface disassemblyCreate {
    name: string
    weight: number
    superior_id: number
}

interface disassemblyCreateInBatches {
    param: disassemblyCreate[]
}

interface disassemblyUpdate {
    id: number
    name?: string
    weight?: number
}

interface disassemblyDelete {
    id: number
}

interface disassemblyGetList extends list {
    project_id?: number
    level?: number
    superior_id?: number
    level_gte?: number
    level_lte?: number
}

const disassemblyApi = {
    get: (param: disassemblyGet) => request.get(
        '/disassembly/' + param.id).then(res => res.data,),
    getTree: (param: disassemblyGetTree) => request.post(
        '/disassembly/tree', param).then(res => res.data,),
    create: (param: disassemblyCreate) => request.post(
        '/disassembly', param).then(res => res.data,),
    createInBatches: (param: disassemblyCreateInBatches) => request.post(
        '/disassembly/batch', param).then(res => res.data,),
    update: (param: disassemblyUpdate) => request.patch(
        '/disassembly/' + param.id, param).then(res => res.data,),
    delete: (param: disassemblyDelete) => request.delete(
        '/disassembly/' + param.id,).then(res => res.data,),
    getList: (param?: disassemblyGetList) => request.post(
        '/disassembly/list', param).then(res => res.data,),
}

export {disassemblyApi,}
