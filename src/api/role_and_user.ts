import request from "@/util/request";

const GetRoles = () => request.get(
    '/api/role_and_user/by_token_in_header'
).then(
    res => {
        //如果token无效，就删掉本地的token
        if (res.data.code === 3001) {
            localStorage.removeItem('access_token')
        }
        return res.data
    },
)

export {GetRoles}
