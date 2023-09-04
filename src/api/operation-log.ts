import {list} from "@/api/common-interface"
import request from "@/utils/request"


interface operationLogGetList extends list {
    project_id?: number
}

const operationLogApi = {
    getList: (param?: operationLogGetList) => request.post('/operation-log/list', param)
        .then(res => res.data),
}

export {operationLogApi,}
