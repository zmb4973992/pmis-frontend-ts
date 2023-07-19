import request from "@/utils/request";

interface contractCumulativeExpenditureUpdate {
    contract_id: number
}

interface contractCumulativeExpenditureGetList {
    contract_id?: number
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const contractCumulativeExpenditureApi = {
    update: (param: contractCumulativeExpenditureUpdate) => request.patch('/contract-cumulative-expenditure/', param)
        .then(res => res.data),
    getList: (param?: contractCumulativeExpenditureGetList) => request.post('/contract-cumulative-expenditure/list', param)
        .then(res => res.data),
}

export {contractCumulativeExpenditureApi,}
