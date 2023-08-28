import request from "@/utils/request";

const fileApi = {
    upload: (param: any) => request.post('/file', param,
        {headers: {'Content-Type': 'multipart/form-data'}}
    ).then(res => res.data),
}

export {fileApi,}
