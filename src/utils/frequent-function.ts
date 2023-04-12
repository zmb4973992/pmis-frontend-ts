import router from "@/router";
import {routeName} from "@/utils/routeName";


const backToHomePage = () => router.push({name: routeName.homePage})
const logout = () => {
        localStorage.removeItem('access_token')
        router.push({name: '登录'})
}

export {backToHomePage,logout}
