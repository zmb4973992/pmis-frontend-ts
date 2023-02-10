import request from "@/utils/request";
import useUserStore from "@/store/user";

export interface Login {
    username: string
    password: string
}

let user = useUserStore()

const login = (data: Login) =>
    request.post('/api/login', data).then(
        // 如果请求成功发出、收到结果
        res => {
            // 如果返回的状态码是0
            if (res.data.code == 0) {
                //更新本地的access_token
                localStorage.setItem('access_token', res.data.data.access_token)
                //更新store里的token
                user.updateToken(res.data.data.access_token)
            }
            return res.data
        },
    )

export {login}
