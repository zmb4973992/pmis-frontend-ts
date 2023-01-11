import request from "@/utils/request";

const GetRoles = () => request.get('/api/role_and_user/by_token_in_header')
    .then(res => res.data,)

export {GetRoles}
