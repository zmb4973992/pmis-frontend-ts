import request from "@/utils/request";

interface cumulativeIncomeAndExpenditureUpdate {
    project_id: number
}

interface cumulativeIncomeAndExpenditureGetList {
    project_id?: number
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const cumulativeIncomeAndExpenditureApi = {
    update: (param: cumulativeIncomeAndExpenditureUpdate) => request.patch('/cumulative-income-and-expenditure/', param)
        .then(res => res.data),
    getList: (param?: cumulativeIncomeAndExpenditureGetList) => request.post('/cumulative-income-and-expenditure/list', param)
        .then(res => res.data),
}

export {cumulativeIncomeAndExpenditureApi,}
