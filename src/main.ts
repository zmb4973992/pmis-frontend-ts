import {createApp} from 'vue'
import App from '@/App.vue'
import router from "@/router";
import store from "@/store";
import Antd from 'ant-design-vue';
//导入antd的css文件
import 'ant-design-vue/dist/antd.css';
//导入css初始化文件
import 'normalize.css'
import '@/router/permission.ts'
//导入图标组件库，并重命名
import * as antIcons from '@ant-design/icons-vue'
import useUserStore from "@/store/user";

const app = createApp(App)

// 注册图标组件，这样就可以动态引用，<component :is="xxx"/>
Object.keys(antIcons).forEach(key =>
    app.component(key, antIcons[key as keyof typeof antIcons])
)

// 把图标组件添加到全局，暂不需要，以后再说
// app.config.globalProperties.$antIcons = antIcons

app.use(store)
    .use(router)
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

