import { defineStore } from 'pinia'
import { ref } from 'vue'

//管理员登录模块 token setToken removeToken
export const useUserStore = defineStore(
    'manager',
    () => {
        const token = ref('')
        const setToken = (newToken) => {
            token.value = newToken
        }
        const removeToken = () => {
            token.value = ''
        }
        return {
            token,
            setToken,
            removeToken
        }
    },
    {
        // 持久化
        //可以是布尔值，也可以是对象，布尔值就是默认的，对象就是按我们自己的办法来
        persist: true
    }
)
