import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

//用于设置别名
const path = require('path');

export default defineConfig({
    plugins: [vue(),],
    //服务器设置
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
    //css预处理器
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/assets/styles/main.scss";'
            }
        }
    },
})
