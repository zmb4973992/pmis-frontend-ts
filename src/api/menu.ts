import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface menuGetList extends list {
    group?: string

}

interface menuGetTree extends list {
    group?: string
}

const menuApi = {
    // get: (param: contractGet) => request.get('/contract/' + param.id)
    //     .then(res => res.data),
    // create: (param: contractCreate) => request.post('/contract', param)
    //     .then(res => res.data,),
    // update: (param: contractUpdate) => request.patch('/contract/' + param.id, param)
    //     .then(res => res.data),
    // delete: (param: contractDelete) => request.delete('/contract/' + param.id)
    //     .then(res => res.data,),
    getList: (param?: menuGetList) => request.post('/menu/list', param)
        .then(res => res.data),
    getTree: (param?: menuGetTree) => request.post('/menu/tree', param)
        .then(res => res.data),
}

export {menuApi,}
