import request from "@/utils/request";

interface incomeAndExpenditureGet {
    id: number
}

interface incomeAndExpenditureCreate {
    project_id?: number
    contract_id?: number
    fund_direction?: number
    currency?: number
    kind?: number //款项种类（计划、实际、预测）
    date?: string
    amount?: number
    exchange_rate?: number
    type?: number //款项类型（预付款、尾款等）
    condition?: string //条件
    term?: string //条款、方式
    remarks?: string //工作内容
    attachment?: string
}

interface incomeAndExpenditureUpdate {
    id: number
    project_id?: number
    contract_id?: number
    fund_direction?: number
    currency?: number
    kind?: number //款项种类（计划、实际、预测）
    date?: string
    amount?: number
    exchange_rate?: number
    type?: number //款项类型（预付款、尾款等）
    condition?: string //条件
    term?: string //条款、方式
    remarks?: string //工作内容
    attachment?: string
}

interface incomeAndExpenditureDelete {
    id: number
}

interface incomeAndExpenditureGetList {
    project_id?: number
    kind?: string //款项种类（计划、实际、预测）
    fund_direction?: string
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const incomeAndExpenditureApi = {
    get: (param: incomeAndExpenditureGet) => request.get('/income-and-expenditure/' + param.id)
        .then(res => res.data),
    create: (param: incomeAndExpenditureCreate) => request.post('/income-and-expenditure', param)
        .then(res => res.data,),
    update: (param: incomeAndExpenditureUpdate) => request.patch('/income-and-expenditure/' + param.id, param)
        .then(res => res.data),
    delete: (param: incomeAndExpenditureDelete) => request.delete('/income-and-expenditure/' + param.id)
        .then(res => res.data,),
    getList: (param?: incomeAndExpenditureGetList) => request.post('/income-and-expenditure/list', param)
        .then(res => res.data),
}

export {incomeAndExpenditureApi,}
