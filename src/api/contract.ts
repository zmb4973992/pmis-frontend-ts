import request from "@/utils/request";

interface contractGet {
    id: number
}

interface contractCreate {
    project_id?: number
    department_id?: number
    related_party_id?: number
    fund_direction?: number
    our_signatory?: number
    currency?: number
    type?: number
    signing_date?: string
    effective_date?: string
    commissioning_date?: string
    completing_date?: string
    amount?: number
    exchange_rate?: number
    construction_period?: number
    name?: string
    code?: string
    content?: string
    deliverable?: string
    penalty_rule?: string
    attachment?: string
    operator?: string
}

interface contractUpdate {
    id: number
    project_id?: number
    department_id?: number
    related_party_id?: number
    fund_direction?: number
    our_signatory?: number
    currency?: number
    type?: number
    signing_date?: string
    effective_date?: string
    commissioning_date?: string
    completing_date?: string
    amount?: number
    exchange_rate?: number
    construction_period?: number
    name?: string
    code?: string
    content?: string
    deliverable?: string
    penalty_rule?: string
    attachment?: string
    operator?: string
}

interface contractDelete {
    id: number
}

interface contractGetList {
    project_id?: number
    fund_direction?: number
    name_include?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const contractApi = {
    get: (param: contractGet) => request.get('/contract/' + param.id)
        .then(res => res.data),
    create: (param: contractCreate) => request.post('/contract', param)
        .then(res => res.data,),
    update: (param: contractUpdate) => request.patch('/contract/' + param.id, param)
        .then(res => res.data),
    delete: (param: contractDelete) => request.delete('/contract/' + param.id)
        .then(res => res.data,),
    getList: (param?: contractGetList) => request.post('/contract/list', param)
        .then(res => res.data),
}

export {contractApi,}
