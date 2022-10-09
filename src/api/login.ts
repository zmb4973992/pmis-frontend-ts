import request from "@/util/axios";

export interface ILoginData {
    username: string
    password: string
}

const login = (data: ILoginData) => request.post('/api/login', data)

const ValidateToken = (token: string) => request.get(
    '/api/validate_token/' + token,
).then(
    res => {
        if (res.data.code === 3001) {
            console.log('token无效，已经删除本地的token')
            localStorage.removeItem('access_token')
            return;
        } else {
            return
        }
    }
)

export {login, ValidateToken}

export default {login, ValidateToken}
