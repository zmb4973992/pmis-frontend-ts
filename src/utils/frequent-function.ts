import router from "@/router";
import {routeName} from "@/utils/routeName";

function backToHomePage() {
    router.push({name: '项目列表'})
}

function logout() {
    localStorage.removeItem('access_token')
    router.push({name: '登录'})
}

export {backToHomePage, logout}
