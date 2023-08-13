// 对axios进行二次封装 目的使用请求与响应拦截器
import axios from 'axios'
// 引入element-plus中的消息提示的组件ElMessage
import { ElMessage } from 'element-plus'
// 引入用户相关的库，用于在请求拦截器中携带仓库中的token
import useUserStore from '@/store/modules/user.ts'

// 第一步：利用axios对象的create方法创建axios实例（配置其他的配置：基础路径、超时的时间等）
const request = axios.create({
  // 和普通的axios不同的是利用axios可以写一些自定义配置
  //可以使用开发环境.env.development文件中的一些变量
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径上会携带/api
  timeout: 5000, // 超时时间为5s
})
// 第二步：request实例添加请求与响应拦截器-interceptors拦截器
// 请求拦截器 传递的请参数为请求的配置
request.interceptors.request.use((config) => {
  // 获取小仓库，获取token，登录成功后携带给服务器
  const userStore = useUserStore()
  // console.log(userStore.token) // 可以拿到token
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  // config配置对象中的headers属性请求头：经常用于给服务器端携带公共参数
  return config // 返回配置对象
})
// 响应拦截器 两个回调：成功与失败 参数为响应的对象
request.interceptors.response.use(
  (response) => {
    // console.log(response)
    // 成功回调【参照mock/user.ts中的假的用户信息】
    return response.data // 简化数据 只拿响应对象中的data数据，不用拿到所有数据组成的对象
  },
  (error) => {
    // 处理http网络错误
    // 定义一个变量：存储网络错误信息
    let message = '' // 起始值为空，根据响应失败对象身上的状态码去处理http网络错误
    // http状态码
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'Token过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '无网络'
    }
    // 提示错误信息
    ElMessage({
      type: 'error',
      message: message,
    })
    // 返回失败的promise 去终结Promise
    return Promise.reject(error)
  },
)
export default request
