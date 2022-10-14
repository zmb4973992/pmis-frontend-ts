//createRouter用于创建路由
//createWebHashHistory用于创建哈希模式的history
//RouteRecordRaw用于限定路由记录的类型，ts专属功能
import {createRouter, createWebHashHistory} from "vue-router";
//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import routes from "@/router/routes";
import {GetRoles} from "@/api/role_and_user";


const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to, from) => {
    NProgress.start()
    //先判断该页是否需要登录。如果需要登录：
    if (to.meta.requireAuth === true) {
        const token = localStorage.getItem('access_token')
        // 如果本地有token
        if (token) {
            console.log(await GetRoles())
            return
        } else {
            //本地没有token，重定向到登录页
            return {name: 'login'}
        }
    }
})

router.afterEach(() => {
    NProgress.done() //进度条结束
})

// 进度条的配置项：ease可以设置css3动画，如ease，linear；speed是进度条从开始到结束的耗时
NProgress.configure({});

export default router
