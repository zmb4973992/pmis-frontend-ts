import request from "@/utils/request";

const fileApi = {
    upload: (param: any) => request.post('/file', param,
        {headers: {'Content-Type': 'multipart/form-data'}}
    ).then(res => res.data),
    download: (fileID: number) => request.get('/file/' + fileID)
        .then(res => res.data),
    // delete: (fileID: number) => request.delete('/file/'+fileID)
    //     .then(res => res.data)
}

export {fileApi,}
