import axios from "axios";
import useUserStore from "@/store/user";

const request = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 5000,  //毫秒
})

const user = useUserStore()

//对发送的请求进行封装
request.interceptors.request.use(
    config => {
        // 在请求头添加access_token
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers!['access_token'] = token
        }
        return config
    },
    //error暂时可以不写，这里写上是为了占位
    error => {
        return Promise.reject(error)
    }
)

//对返回结果进行封装
request.interceptors.response.use(
    //暂时不要只返回data，因为可能需要系统的状态码
    // (res) => {
        // 如果返回结果的错误代码为3001（token无效），则删掉本地的token
        // if (res.data.code! === 3001) {
        //     localStorage.removeItem('access_token')
        // }
        // return res.data
    // },
    //error暂时可以不写，这里写上是为了占位
    // error => {
    //     return Promise.reject(error)
    // }
)

export default request

