import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface projectDailyAndCumulativeIncomeUpdate {
    project_id: number
}

interface projectDailyAndCumulativeIncomeGetList extends list {
    project_id?: number
    date_gte?: string
    date_lte?: string
}

const projectDailyAndCumulativeIncomeApi = {
    update: (param: projectDailyAndCumulativeIncomeUpdate) => request.patch('/project-daily-and-cumulative-income/', param)
        .then(res => res.data),
    getList: (param?: projectDailyAndCumulativeIncomeGetList) => request.post('/project-daily-and-cumulative-income/list', param)
        .then(res => res.data),
}

export {projectDailyAndCumulativeIncomeApi,}
