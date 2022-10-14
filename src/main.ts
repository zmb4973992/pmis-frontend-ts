import {createApp} from 'vue'
import App from '@/App.vue'
import router from "@/router";
import store from "@/store";
import Antd from 'ant-design-vue';
//导入antd的css文件
import 'ant-design-vue/dist/antd.css';
//导入css初始化文件
import 'normalize.css'
//导入自己写的css文件
import '@/assets/styles/main.css'


const app = createApp(App)
app.use(store)
    .use(router)
    .use(Antd)
    .mount('#app')
