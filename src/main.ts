import {createApp} from 'vue'
import App from '@/App.vue'
import router from "@/router";
import store from "@/store";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'virtual:windi.css'
// import './permission';
// test

const app = createApp(App)
app.use(router)
    .use(store)
    .use(Antd)
    .mount('#app')
