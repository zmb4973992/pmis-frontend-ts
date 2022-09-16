import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

//用于设置别名
const path = require('path');

export default defineConfig({
    plugins: [vue(),],
    server: {
        port: 4000, // 设置服务启动端口号
        open: true, // 设置服务启动时是否自动打开浏览器
    },
    //用于设置别名
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "src")
        }
    },
})
