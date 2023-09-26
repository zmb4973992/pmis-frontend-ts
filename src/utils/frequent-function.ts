import router from "@/router";

function backToHomePage() {
    router.push({name: '首页'})
}

function logout() {
    localStorage.removeItem('access_token')
    router.push({name: '登录'})
}

export {backToHomePage, logout}
