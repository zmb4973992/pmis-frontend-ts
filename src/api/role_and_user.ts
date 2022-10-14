import request from "@/util/axios";

const GetRoles = () => request.get(
    '/api/role_and_user/by_token_in_header'
)

export {GetRoles}
