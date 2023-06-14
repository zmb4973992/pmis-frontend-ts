import request from "@/utils/request";

interface cumulativeProjectIncomeAndExpenditureUpdate {
    project_id: number
}

interface cumulativeProjectIncomeAndExpenditureGetList {
    project_id?: number
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const cumulativeProjectIncomeAndExpenditureApi = {
    update: (param: cumulativeProjectIncomeAndExpenditureUpdate) => request.patch('/cumulative-project-income-and-expenditure/', param)
        .then(res => res.data),
    getList: (param?: cumulativeProjectIncomeAndExpenditureGetList) => request.post('/cumulative-project-income-and-expenditure/list', param)
        .then(res => res.data),
}

export {cumulativeProjectIncomeAndExpenditureApi,}
