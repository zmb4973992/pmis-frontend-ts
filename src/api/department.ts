import request from "@/util/request";

//接口只能一次性导出，不能先定义、再导出
export interface IDepartment {
    name: string
    level: string
    superior_id: number
}

export interface IDepartmentList {
    project_id?: number
    superior_id?: number
    level?:number
    level_gte?:number
    level_lte?:number
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const GetDepartment = (DepartmentID: number) => request.get(
    '/api/department/' + DepartmentID
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const UpdateDepartment = (DepartmentID: number, param: IDepartment) => request.put(
    '/api/department/' + DepartmentID,
    param,
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const CreateDepartment = (param: IDepartment) => request.post(
    '/api/department',
    param
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const DeleteDepartment = (DepartmentID: number) => request.delete(
    '/api/department/' + DepartmentID,
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

const GetDepartmentList = (params: IDepartmentList) => request.get(
    '/api/department/list',
    {params}
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

export {
    GetDepartment,
    UpdateDepartment,
    CreateDepartment,
    DeleteDepartment,
    GetDepartmentList
}
