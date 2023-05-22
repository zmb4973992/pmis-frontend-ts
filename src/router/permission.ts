import NProgress from "nprogress";
import router from "@/router/index";
import useUserStore from "@/store/user";
import {menuApi} from "@/api/menu";
import {message} from "ant-design-vue";
import routes from "@/router/routes";
import {routeName} from "@/utils/routeName";

router.beforeEach(async (to, from) => {
    NProgress.start()
    //先判断该页是否需要登录。如果需要登录：
    if (to.meta.requireAuth === true) {
        const token = localStorage.getItem('access_token')
        // 如果本地有token
        if (token) {
            try {
                // 请求菜单列表
                const res = await menuApi.getList()
                console.log(res.data);

                // changeRouteData(res.data)


            } catch (e) {
                message.warn("获取路由失败")
            }


        } else {
            //页面需要登录，且本地没有token，则重定向到登录页
            return {name: '登录'}
        }
    }

    const user = useUserStore()
    if (!user.accessToken) {
        user.updateUserInfo()
    }
})

function changeRouteData(data: any[]) {
    data.forEach(
        item => {
            routes.push(
                {
                    path: item.path,
                    name: item.name,
                    component: () => import('@/pages/test.vue'),
                }
            )
        }
    )
}
