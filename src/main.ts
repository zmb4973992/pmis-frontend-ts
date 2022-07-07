import {createApp} from 'vue'
import App from '@/App.vue'
import router from "@/router";
import store from "@/store";
import {Button, Rate} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import './permission';

const app = createApp(App)
app.use(router)
    .use(store)
    .use(Button)
    .use(Rate)
    .mount('#app')
