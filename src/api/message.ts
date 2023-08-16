import request from "@/utils/request";
import {list} from "@/api/common-interface";

interface messageGet {
    id: number
}

interface messageCreate {
    recipients: number[]
    title: string
    content: string
}

interface messageUpdate {
    id:number
}

interface messageDelete {
    id: number
}

interface messageGetList extends list {
    is_read?: boolean
}


const messageApi = {
    get: (param: messageGet) => request.get('/message/' + param.id)
        .then(res => res.data,),
    create: (param: messageCreate) => request.post('/message', param)
        .then(res => res.data,),
    update: (param:messageUpdate) => request.patch('/message/' + param.id)
        .then(res => res.data,),
    delete: (param: messageDelete) => request.delete('/message/' + param.id)
        .then(res => res.data),
    getList: (param?: messageGetList) => request.post('/message/list', param)
        .then(res => res.data),
}

export {messageApi,}
