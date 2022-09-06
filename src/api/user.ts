import request from "@/util/axios";
import {AxiosRequestConfig} from "axios";

//接口只能一次性导出，不能先定义、再导出
export interface IUpdateUser {
    full_name: string
    email_address: string
    is_valid: boolean
    mobile_phone_number: string
    employee_number: string
}

export interface IUserList {
    id_gte?: number,
    id_lte?: number,
    is_valid?: boolean,
    username_include?: string,
    page?: number,
    page_size?: number,
    order_by?: string,
    desc?: boolean,
}

export interface ICreateUser extends IUpdateUser {
    username: string
    password: string
}

const GetUser = (userID: number) => request.get(
    '/api/user/' + userID
)

const UpdateUser = (userID: number, param: IUpdateUser) => request.put(
    '/api/user/' + userID,
    param,
)

const CreateUser = (param: ICreateUser) => request.post(
    '/api/user',
    param
)

const DeleteUser = (userID: number) => request.delete(
    '/api/user/' + userID,
)

const GetUserList = (param: IUserList) => request.get(
    '/api/user/list',
    param
)

export {GetUser, UpdateUser, CreateUser, DeleteUser, GetUserList}



