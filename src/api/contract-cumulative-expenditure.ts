import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface contractCumulativeExpenditureUpdate {
    contract_id: number
}

interface contractCumulativeExpenditureGetList extends list {
    contract_id?: number
    date_gte?: string
    date_lte?: string
}

const contractCumulativeExpenditureApi = {
    update: (param: contractCumulativeExpenditureUpdate) => request.patch('/contract-cumulative-expenditure/', param)
        .then(res => res.data),
    getList: (param?: contractCumulativeExpenditureGetList) => request.post('/contract-cumulative-expenditure/list', param)
        .then(res => res.data),
}

export {contractCumulativeExpenditureApi,}
