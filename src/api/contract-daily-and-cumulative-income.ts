import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface contractDailyAndCumulativeIncomeUpdate {
    contract_id: number
}

interface contractDailyAndCumulativeIncomeGetList extends list {
    contract_id?: number
    date_gte?: string
    date_lte?: string
}

const contractDailyAndCumulativeIncomeApi = {
    update: (param: contractDailyAndCumulativeIncomeUpdate) => request.patch('/contract-daily-and-cumulative-income/', param)
        .then(res => res.data),
    getList: (param?: contractDailyAndCumulativeIncomeGetList) => request.post('/contract-daily-and-cumulative-income/list', param)
        .then(res => res.data),
}

export {contractDailyAndCumulativeIncomeApi,}
