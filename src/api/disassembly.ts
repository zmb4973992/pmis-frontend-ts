import request from "@/utils/request";
import {log} from "echarts/types/src/util/log";

//接口只能一次性导出，不能先定义、再导出
export interface IDisassembly {
    name: string
    project_id: number
    level: number
    weight: number
    superior_id: number
}

export interface IDisassemblyList {
    project_id?: number
    superior_id?: number
    level?: number
    level_gte?: number
    level_lte?: number
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const GetDisassembly = (disassemblyID: number) => request.get(
    '/api/disassembly/' + disassemblyID).then(res => res.data,)

const GetDisassemblyTree = (projectID: number) => request.post(
    '/api/disassembly/tree', {project_id: projectID}).then(res => res.data,)

const UpdateDisassembly = (disassemblyID: number, param: IDisassembly) => request.put(
    '/api/disassembly/' + disassemblyID, param).then(res => res.data,)

const CreateDisassembly = (param: IDisassembly) => request.post(
    '/api/disassembly', param).then(res => res.data,)

const CreateDisassemblyInBatches = (param: IDisassembly[]) => request.post(
    '/api/disassembly/batch', param).then(res => res.data,)

const DeleteDisassembly = (disassemblyID: number) => request.delete(
    '/api/disassembly/' + disassemblyID,).then(res => res.data,)

const GetDisassemblyList = (params: IDisassemblyList) => request.get(
    '/api/disassembly/list', {params}).then(res => res.data,)

export {
    GetDisassembly,
    GetDisassemblyTree,
    UpdateDisassembly,
    CreateDisassembly,
    CreateDisassemblyInBatches,
    DeleteDisassembly,
    GetDisassemblyList
}
