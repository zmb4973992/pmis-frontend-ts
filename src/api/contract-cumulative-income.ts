import request from "@/utils/request";

interface contractCumulativeIncomeUpdate {
    contract_id: number
}

interface contractCumulativeIncomeGetList {
    contract_id?: number
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const contractCumulativeIncomeApi = {
    update: (param: contractCumulativeIncomeUpdate) => request.patch('/contract-cumulative-income/', param)
        .then(res => res.data),
    getList: (param?: contractCumulativeIncomeGetList) => request.post('/contract-cumulative-income/list', param)
        .then(res => res.data),
}

export {contractCumulativeIncomeApi,}
