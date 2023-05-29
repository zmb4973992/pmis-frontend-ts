import request from "@/utils/request";

interface iOrganizationGet {
    id: number
}

interface iOrganizationCreate {
    name: string
    level_name: string
    superior_id: number
}

interface iOrganizationUpdate {
    id: number,
    name?: string
    level_name?: string
    superior_id?: number
}

interface iOrganizationDelete {
    id: number
}

interface iOrganizationGetList {
    is_showed_by_role?: boolean
    superior_id?: number
    level_name?: string
    name?: string
    name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}


const organizationApi = {
    get: (param: iOrganizationGet) => request.get('/organization/' + param.id)
        .then(res => res.data,),
    update: (param: iOrganizationUpdate) => request.patch('/organization/' + param.id, param)
        .then(res => res.data,),
    create: (param: iOrganizationCreate) => request.post('/organization', param)
        .then(res => res.data,),
    delete: (param: iOrganizationDelete) => request.delete('/organization' + param.id)
        .then(res => res.data),
    getList: (param?: iOrganizationGetList) => request.post('/organization/list', param)
        .then(res => res.data),
}

export {organizationApi,}
