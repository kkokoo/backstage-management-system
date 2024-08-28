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
// 上传图片使用elementPlus自己封装的方法有跨域问题
export const userUploadService = (data) => request.post('/guanliyuan/upload', data)
export const userDelectimagesService = ({ id }) => request.post('/guanliyuan/delectimages', { id })
export const userGetallimagesService = () => request.get('/guanliyuan/getallimages')

// 就业
export const userGetmapService = () => request.get('/guanliyuan/getmap')
export const userEditmapService = ({ name, value }) => request.post('/guanliyuan/editmap', { name, value })
