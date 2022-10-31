import {useRouter} from "vue-router";

const router = useRouter()
const backToHomePage = () => router.push({name: 'home'})
const logout = () => {
        localStorage.removeItem('access_token')
        router.push({name: 'login'})
}

export {backToHomePage,logout}
