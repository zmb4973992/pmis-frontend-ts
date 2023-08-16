import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface contractCumulativeIncomeUpdate {
    contract_id: number
}

interface contractCumulativeIncomeGetList extends list {
    contract_id?: number
    date_gte?: string
    date_lte?: string
}

const contractCumulativeIncomeApi = {
    update: (param: contractCumulativeIncomeUpdate) => request.patch('/contract-cumulative-income/', param)
        .then(res => res.data),
    getList: (param?: contractCumulativeIncomeGetList) => request.post('/contract-cumulative-income/list', param)
        .then(res => res.data),
}

export {contractCumulativeIncomeApi,}
