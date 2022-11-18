import axios from "axios";
import {message} from "ant-design-vue";
import router from "@/router"

const request = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 5000,  //毫秒
})

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
    err => {
        console.log('发送请求错误'+err)
        return Promise.reject(err)
    }
)

//对返回结果进行封装
request.interceptors.response.use(
    //暂时不要只返回data，因为ts下使用res.XXX会报错，只能使用res.data.XXX
    (res) => {
        // 如果返回结果的错误代码为3001（token无效），则清除本地缓存
        if (res.data.code === 3001) {
            // localStorage.removeItem('access_token')
            localStorage.clear()
            message.error('登录超时，请重新登录')
            router.push({name:'登录'})
            return
        }
        return res
    },
    err => {
        console.log(err)
        return err
    }
)

export default request

