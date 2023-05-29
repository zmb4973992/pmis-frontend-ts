import request from "@/utils/request";

// interface menuGet {
//     id: number
// }

// interface contractCreate {
//     project_id?: number
//     department_id?: number
//     related_party_id?: number
//     fund_direction?: number
//     our_signatory?: number
//     currency?: number
//     type?: number
//     signing_date?: string
//     effective_date?: string
//     commissioning_date?: string
//     completing_date?: string
//     amount?: number
//     exchange_rate?: number
//     construction_period?: number
//     name?: string
//     code?: string
//     content?: string
//     deliverable?: string
//     penalty_rule?: string
//     attachment?: string
//     operator?: string
// }

// interface contractUpdate {
//     id: number
//     project_id?: number
//     department_id?: number
//     related_party_id?: number
//     fund_direction?: number
//     our_signatory?: number
//     currency?: number
//     type?: number
//     signing_date?: string
//     effective_date?: string
//     commissioning_date?: string
//     completing_date?: string
//     amount?: number
//     exchange_rate?: number
//     construction_period?: number
//     name?: string
//     code?: string
//     content?: string
//     deliverable?: string
//     penalty_rule?: string
//     attachment?: string
//     operator?: string
// }

// interface contractDelete {
//     id: number
// }

interface menuGetList {
    group?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

interface menuGetTree {
    group?: string
    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const menuApi = {
    // get: (param: contractGet) => request.get('/contract/' + param.id)
    //     .then(res => res.data),
    // create: (param: contractCreate) => request.post('/contract', param)
    //     .then(res => res.data,),
    // update: (param: contractUpdate) => request.patch('/contract/' + param.id, param)
    //     .then(res => res.data),
    // delete: (param: contractDelete) => request.delete('/contract/' + param.id)
    //     .then(res => res.data,),
    getList: (param?: menuGetList) => request.post('/menu/list', param)
        .then(res => res.data),
    getTree: (param?: menuGetTree) => request.post('/menu/tree', param)
        .then(res => res.data),
}

export {menuApi,}
