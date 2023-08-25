import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface contractDailyAndCumulativeExpenditureUpdate {
    contract_id: number
}

interface contractDailyAndCumulativeExpenditureGetList extends list {
    contract_id?: number
    date_gte?: string
    date_lte?: string
}

const contractDailyAndCumulativeExpenditureApi = {
    update: (param: contractDailyAndCumulativeExpenditureUpdate) => request.patch('/contract-daily-and-cumulative-expenditure/', param)
        .then(res => res.data),
    getList: (param?: contractDailyAndCumulativeExpenditureGetList) => request.post('/contract-daily-and-cumulative-expenditure/list', param)
        .then(res => res.data),
}

export {contractDailyAndCumulativeExpenditureApi,}
