import request from "@/util/axios";

const getUserInfo = (userID: number) => request.get('/api/user/' + userID)

export {getUserInfo}


