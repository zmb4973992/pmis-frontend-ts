import request from "@/utils/request";

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

const disassemblyApi = {
    getDisassembly: (disassemblyID: number) => request.get(
        '/api/disassembly/' + disassemblyID).then(res => res.data,),
    getDisassemblyTree: (projectID: number) => request.post(
        '/api/disassembly/tree', {project_id: projectID}).then(res => res.data,),
    getDisassemblyList: (params: IDisassemblyList) => request.get(
        '/api/disassembly/list', {params}).then(res => res.data,),
    updateDisassembly: (disassemblyID: number, param: IDisassembly) => request.put(
        '/api/disassembly/' + disassemblyID, param).then(res => res.data,),
    createDisassembly: (param: IDisassembly) => request.post(
        '/api/disassembly', param).then(res => res.data,),
    createDisassemblyInBatches: (param: IDisassembly[]) => request.post(
        '/api/disassembly/batch', param).then(res => res.data,),
    deleteDisassembly: (disassemblyID: number) => request.delete(
        '/api/disassembly/' + disassemblyID,).then(res => res.data,),
    deleteDisassemblyWithSubitems: (disassemblyID: number) =>
        request.delete('/api/disassembly/' + disassemblyID,).then(res => res.data,),
}

export {disassemblyApi,}
