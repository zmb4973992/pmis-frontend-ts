import request from "@/utils/request";

const GetRoles = () => request.get('/api/role-and-user/by-token-in-header')
    .then(res => res.data,)

export {GetRoles}
