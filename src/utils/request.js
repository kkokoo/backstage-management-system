import axios from 'axios'
import { ElMessage } from 'element-plus'
//获取到token
import { useUserStore } from '@/stores'
//导入路由跳转到登录界面
import router from '@/router'
const baseURL = '/api'
const instance = axios.create({
    //1.基础地址，超时时间
    baseURL,
    timeout: 10000
})
//请求拦截器
instance.interceptors.request.use(
    (config) => {
        //2.携带token,作用是让所有axios请求携带token，后台需要token校验是否登录
        const useStore = useUserStore()
        if (useStore.token) {
            config.headers['token'] = useStore.token
        }
        return config
    },
    (err) => Promise.reject(err)
)
//响应拦截器
instance.interceptors.response.use(
    (res) => {
        //3.处理业务失败
        //处理业务失败，给出错误提示，抛出错误
        //4.摘取核心响应数据
        if (res.data.code !== 601) {
            return res
        }
        //5.处理成功任务

        const useStore = useUserStore()
        ElMessage.error(res.data.desc || '服务异常')
        useStore.removeToken()
        router.push('/login')
        return Promise.reject(res.data)
    },
    (err) => {
        //处理401错误
        //错误的特殊情况=>401权限不足，token过期
        if (err.response?.status === 401) {
            ElMessage.error('请先登录')
            router.push('/login')
        } else if (err.response?.status === 500) {
            ElMessage.error('Token过期，请重新登录')
            router.push('/login')
        } else if (err.response?.status === 404) ElMessage.error('获取数据失败')
        //错误的默认情况=>只要给提示
        ElMessage.error(err.response.data.desc || '服务异常')
        return Promise.reject(err)
    }
)

//暴露实例
export default instance
