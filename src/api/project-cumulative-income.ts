import request from "@/utils/request";

interface projectCumulativeIncomeUpdate {
    project_id: number
}

interface projectCumulativeIncomeGetList {
    project_id?: number
    date_gte?: string
    date_lte?: string

    page?: number
    page_size?: number
    order_by?: string
    desc?: boolean
}

const projectCumulativeIncomeApi = {
    update: (param: projectCumulativeIncomeUpdate) => request.patch('/project-cumulative-income/', param)
        .then(res => res.data),
    getList: (param?: projectCumulativeIncomeGetList) => request.post('/project-cumulative-income/list', param)
        .then(res => res.data),
}

export {projectCumulativeIncomeApi,}
