import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface projectDailyAndCumulativeExpenditureUpdate {
    project_id: number
}

interface projectDailyAndCumulativeExpenditureGetList extends list {
    project_id?: number
    date_gte?: string
    date_lte?: string
}

const projectDailyAndCumulativeExpenditureApi = {
    update: (param: projectDailyAndCumulativeExpenditureUpdate) => request.patch('/project-daily-and-cumulative-expenditure/', param)
        .then(res => res.data),
    getList: (param?: projectDailyAndCumulativeExpenditureGetList) => request.post('/project-daily-and-cumulative-expenditure/list', param)
        .then(res => res.data),
}

export {projectDailyAndCumulativeExpenditureApi,}
