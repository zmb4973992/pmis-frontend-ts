import request from "@/util/axios";

export const getUserInfo = (userID: number) => request.get('/api/user/'+userID)


