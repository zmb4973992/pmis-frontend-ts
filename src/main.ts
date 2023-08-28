import {createApp} from 'vue'
import App from '@/App.vue'
import router, {buildRoutes} from "@/router";
import store from "@/store";
import Antd, {message} from 'ant-design-vue';
//导入antd的css文件
import 'ant-design-vue/dist/antd.css';
//导入css初始化文件
import 'normalize.css'
//导入图标组件库，并重命名
import * as antIcons from '@ant-design/icons-vue'
import useUserStore from "@/store/user";

/*
 * -------------------- ※ 着重 解释说明下这里的初始化逻辑 begin ※ --------------------
 *
 * 很多前端设计都是直接创建vue实例，然后挂载路由router、状态管理store等等，但是关于router这块是有问题的；
 * 现在大部分路由都是从后台返回的，这个时候前端是没有从后端请求到所有路由的，所以只能写到路由拦截器里，这也很不清晰；
 * 流程应该是：
 * 如果存在登录信息，则先想后端请求用户的所有路由，然后加载，再去创建vue实例和挂载路由
 * 如果不存在路由信息，则创建vue实例和挂载路由（此时的路由应该只有login页面，因为用户拥有哪些路由是登录之后才知道的）
 *
 * -------------------- ※ 着重 解释说明下这里的初始化逻辑 end ※ --------------------
 */

const accessToken = localStorage.getItem('access_token')

if (accessToken) {
    updateRoutesAndMenus()
} else {
    initVue()
}

async function updateRoutesAndMenus() {
    try {
        // const res = await menuApi.getTree()
        // const routeList = res.data.filter((item: any) => item.id) //虚空过滤，不过滤就报错，原因暂时不明
        //构建路由
        // buildRoutes(routeList)
        //初始化
        initVue()
        //构建菜单
        // useMenuStore().updateMenus(res.data)
        // console.log("menu store:",useMenuStore().menuTree);

    } catch (e: any) {
        message.error(e);
    }
}

function initVue() {
    const app = createApp(App)

// 注册图标组件，这样就可以动态引用，<component :is="xxx"/>
    Object.keys(antIcons).forEach(key =>
        app.component(key, antIcons[key as keyof typeof antIcons])
    )

// 把图标组件添加到全局，暂不需要，以后再说
// app.config.globalProperties.$antIcons = antIcons

    app.use(router)
        .use(store)
        .use(Antd)

//设置自定义指令，用到了store，需要上面use(store)后才能执行
    app.directive(
        'permitted-roles', {
            mounted(element, binding) {
                const userRole = useUserStore().roles
                let isPermitted = false
                for (let permittedRole of binding.value) {
                    if (userRole.includes(permittedRole)) {
                        isPermitted = true
                        break
                    }
                }
                if (!isPermitted) {
                    element.remove()
                    //网上大多用这种方法，不清楚原因
                    // element.parentNode.removeChild(element)
                }
            }
        }
    )

    app.mount('#app')
}

