import request from "@/utils/request";

interface projectCumulativeExpenditureUpdate {
    project_id: number
}

interface projectCumulativeExpenditureGetList {
    project_id?: number
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const projectCumulativeExpenditureApi = {
    update: (param: projectCumulativeExpenditureUpdate) => request.patch('/project-cumulative-expenditure/', param)
        .then(res => res.data),
    getList: (param?: projectCumulativeExpenditureGetList) => request.post('/project-cumulative-expenditure/list', param)
        .then(res => res.data),
}

export {projectCumulativeExpenditureApi,}
