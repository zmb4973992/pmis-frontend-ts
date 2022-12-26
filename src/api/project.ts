import request from "@/utils/request";

//接口只能一次性导出，不能先定义、再导出
export interface IProject {
    project_code: string
    project_full_name: string
    project_short_name: string
    country: string
    province: string
    project_type: string
    amount: number
    currency: string
    exchange_rate: number
    department_id: number
    related_party_id: number
}

interface pagingAndSorting {
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

export interface IProjectList extends pagingAndSorting {
    department_id_in?: number[]
    project_name_like?: string
    verify_role?: boolean
}

const GetProject = (projectID: number) => request.get(
    '/api/project/' + projectID).then(res => res.data)

const CreateProject = (param: IProject) => request.post(
    '/api/project', param).then(res => res.data,)

const UpdateProject = (projectID: number, param: IProject) => request.put(
    '/api/project/' + projectID, param).then(res => res.data,)

const DeleteProject = (projectID: number) => request.delete(
    '/api/project/' + projectID).then(res => res.data,)

const GetProjectList = (data?: IProjectList) => {
    if (data) {
        return request.post('/api/project/list', data)
            .then(res => res.data,)
    }
    return request.post('/api/project/list')
        .then(res => res.data,)
}

export {
    GetProject,
    CreateProject,
    UpdateProject,
    DeleteProject,
    GetProjectList,
}
