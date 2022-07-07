import {createApp} from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import {Button, Rate} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

//使用各种功能
app.use(router)
    .use(store)
    .use(Button)
    .use(Rate)

    //挂载示例，官方写法
    .mount('#app')
