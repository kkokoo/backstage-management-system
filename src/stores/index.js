import { createPinia } from 'pinia'
//Pinia持久化插件
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)

export default pinia

//统一导入
// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCounterStore } from './modules/counter'
// export { useCounterStore }

//更简单的写法
export * from './modules/user'
export * from './modules/counter'
