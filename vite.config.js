import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        })
    ],
    base: '/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        open: true, // 在启动开发，会自服务器时动打开浏览器并访问指定的地址
        proxy: {
            '/api': {
                target: 'https://abmy.online/welcome', // 接口域名
                changeOrigin: true, // 是否跨域
                ws: true, // 是否代理 websockets
                secure: true, // 是否htpps接口
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
