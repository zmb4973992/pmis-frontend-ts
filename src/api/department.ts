import request from "@/utils/request";

//接口只能一次性导出，不能先定义、再导出
export interface IDepartment {
    name: string
    level: string
    superior_id: number
}

export interface IDepartmentList {
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

const GetDepartment = (DepartmentID: number) => request.get(
    '/api/department/' + DepartmentID).then(res => res.data,)

const UpdateDepartment = (DepartmentID: number, param: IDepartment) => request.put(
    '/api/department/' + DepartmentID, param,).then(res => res.data,)

const CreateDepartment = (param: IDepartment) => request.post(
    '/api/department', param).then(res => res.data,)

const DeleteDepartment = (DepartmentID: number) => request.delete(
    '/api/department/' + DepartmentID).then(res => res.data,)

const GetDepartmentList = (data?: IDepartmentList) => {
    if (data) {
        return request.post('/api/department/list', data)
            .then(res => res.data,)
    }
    return request.post('/api/department/list')
        .then(res => res.data,)
}

export {
    GetDepartment,
    UpdateDepartment,
    CreateDepartment,
    DeleteDepartment,
    GetDepartmentList
}
