import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
//createRouter 创建路由实例
//配置history模式
//1.history模式：createWebHistory  地址栏不带井号
//2.hash模式：createWebHashHistory 地址栏带井号
const router = createRouter({
    //访问的路径的前缀，vite当中的环境变量import.meta.env.BASE_URL.
    // 可以在vite.config.js中的base属性进行配置
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            component: () => import('../views/login/LoginPage.vue')
        },
        {
            path: '/',
            component: () => import('../views/layout/LayoutContainer.vue'),
            // 默认跳转到的位置
            redirect: '/manage/freshman',
            children: [
                {
                    path: '/manage/freshman',
                    component: () => import('../views/freshman/FreshmanManage.vue')
                },
                {
                    path: '/manage/employment',
                    component: () => import('../views/employment/EmploymentManage.vue')
                },
                {
                    path: '/manage/slideshow',
                    component: () => import('../views/slideshow/SlideshowManage.vue')
                }
            ]
        }
    ]
})

// 路由守卫的配置
router.beforeEach((to) => {
    const useStore = useUserStore()
    if (!useStore.token && to.path !== '/login') return '/login'
})
export default router
