import NProgress from "nprogress";
import {GetRoles} from "@/api/role-and-user";
import router from "@/router/index";
import useUserStore from "@/store/user";

router.beforeEach(async (to, from) => {
    NProgress.start()
    //先判断该页是否需要登录。如果需要登录：
    if (to.meta.requireAuth === true) {
        const token = localStorage.getItem('access_token')
        // 如果本地有token
        if (token) {
            // 获取登录用户的角色
            const rolesData = await GetRoles()
            // 如果登录用户有角色的话
            if (rolesData.code === 0) {
                //开始判断用户是否有权限访问路由
                let permitted = false
                // 对用户所有的角色名称进行遍历
                for (let roleName of rolesData.data.role_names) {
                    if (permitted) {
                        break
                    }
                    // 再对路由的允许访问角色进行遍历
                    for (let permittedRole of to.meta.permittedRoles as string[]) {
                        //如果两边的权限有相同值，则允许访问
                        if (roleName === permittedRole) {
                            permitted = true
                            break
                        }
                    }
                }
                //双层遍历后两边权限没有相同值，则跳转到403（无权访问页）
                if (!permitted) {
                    return {name: '403'}
                }
            }
        } else {
            //本地没有token，重定向到登录页
            return {name: '登录'}
        }
    }

    let user = useUserStore()
    if (!user.accessToken) {
        user.updateUserInfo()
    }
})
