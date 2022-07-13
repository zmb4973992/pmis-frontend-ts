import axios from "axios";

const request = axios.create({
    baseURL:'http://127.0.0.1:8000',
    timeout:5000,  //毫秒
})

export default request

