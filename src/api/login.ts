import request from "@/util/axios";

export interface ILoginData {
    username: string
    password: string
}

export const login = (data: ILoginData) => request.post('/api/login', data)


