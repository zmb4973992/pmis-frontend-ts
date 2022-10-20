//createRouter用于创建路由
//createWebHashHistory用于创建哈希模式的history
//RouteRecordRaw用于限定路由记录的类型，ts专属功能
import {createRouter, createWebHashHistory} from "vue-router";
//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import routes from "@/router/routes";

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.afterEach(() => {
    NProgress.done() //进度条结束
})

// 进度条的配置项：ease可以设置css3动画，如ease，linear；speed是进度条从开始到结束的耗时
NProgress.configure({});

export default router
