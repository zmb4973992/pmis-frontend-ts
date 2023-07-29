import router from "@/router";
import {routeName} from "@/utils/routeName";

function backToHomePage() {
    router.push({name: routeName.homePage})
}

function logout() {
    localStorage.removeItem('access_token')
    router.push({name: '登录'})
}

export {backToHomePage, logout}
