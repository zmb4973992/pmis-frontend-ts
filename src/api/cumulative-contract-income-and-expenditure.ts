import request from "@/utils/request";

interface cumulativeContractIncomeAndExpenditureUpdate {
    contract_id: number
}

interface cumulativeContractIncomeAndExpenditureGetList {
    contract_id?: number
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const cumulativeContractIncomeAndExpenditureApi = {
    update: (param: cumulativeContractIncomeAndExpenditureUpdate) => request.patch('/cumulative-contract-income-and-expenditure/', param)
        .then(res => res.data),
    getList: (param?: cumulativeContractIncomeAndExpenditureGetList) => request.post('/cumulative-contract-income-and-expenditure/list', param)
        .then(res => res.data),
}

export {cumulativeContractIncomeAndExpenditureApi,}
