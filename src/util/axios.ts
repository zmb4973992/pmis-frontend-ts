import axios from "axios";

const request = axios.create({
    baseURL:'http://127.0.0.1:8000',
    timeout:5000,  //毫秒
})

//对返回结果进行封装
request.interceptors.response.use(
    //暂时不要只返回data，因为可能需要系统的状态码
    // (res)=>{
    //     return res.data
    // }
)

export default request

