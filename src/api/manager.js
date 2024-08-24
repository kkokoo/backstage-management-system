import request from '@/utils/request'

// 登录登出（请求api完成）
export const userLoginService = ({ name, password }) => request.post('/guanliyuan/login', { name, password })
export const userLogoutService = () => request.post('/guanliyuan/logout')

// 新生
export const userSelectallService = ({ page }) => request.post('/guanliyuan/selectall', { page })
export const userDelectService = ({ id }) => request.post('/guanliyuan/delect', { id })
export const userUpdateService = ({ id, name, xuehao, banji, youxiang, fangxiang }) =>
    request.post('/guanliyuan/update', { id, name, xuehao, banji, youxiang, fangxiang })
export const userInsertService = ({ name, youxiang, xuehao, banji, fangxiang, jieshao }) =>
    request.post('/guanliyuan/insert', { name, youxiang, xuehao, banji, fangxiang, jieshao })

// 新生信息下载到表格（请求api完成）
// 请求体中必须携带{ responseType: 'blob' }告诉浏览器这是一个文件，
// 从而下载为可读文件
export const userDownloadService = () => request.get('/guanliyuan/download', { responseType: 'blob' })

// 轮播图
export const userUploadService = () => request.post('/guanliyuan/upload')
export const userDelectimagesService = () => request.post('/guanliyuan/delectimages')

// 就业
