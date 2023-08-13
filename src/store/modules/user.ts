// 用户相关的小仓库
import { defineStore } from 'pinia'
// 引入api接口 reqLogin发送登录请求 reqUserInfo用于获取用户请求
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index.ts'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
// 引入小仓库state类型
import type { UserState } from './types/type'
// 引入封装的本地存储和读取token的方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token.ts'
// 引入路由(常量路由)数组，用于后面路由的递归遍历
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'

// 引入深拷贝api 因为lodash中文件是js文件，没有ts类型，所以需要忽略
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
// 引入路由器 在路由器渲染之前将得到的新的路由配置对象添加到路由器
import router from '@/router'

// 菜单路由权限的实现 封装方法
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        // 注意：这样可能会修改asyncRoute原数据，所以在传入参数时需要使用深拷贝
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 采用选项式api写法 state actions getters
const useUserStore = defineStore('User', {
  // state
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识 localStorage.getItem('TOKEN')
      menuRoutes: constantRoute, //仓库存储递归生成菜单的路由数组
      username: '',
      avatar: '',
      //存储当前用户是否包含某一个按钮
      buttons: [],
    }
  },
  // 异步|逻辑的地9
  actions: {
    // 用户登录的方法 async会返回一个promise对象 其有三种状态 可以方便查看是否成功
    async userLogin(data: loginFormData) {
      // 发送登录请求需要引入统一api 由于reqLogin返回的是一个Promise，使用async和await
      // await最主要的意图是用来等待 Promise 对象的状态被 resolved
      const result: loginResponseData = await reqLogin(data)
      //登录请求:成功200->token
      //登录请求:失败201->登录失败错误的信息
      if (result.code === 200) {
        // pinia存储token result.data.token
        // pinia|vuex存储数据利用的就是js对象
        this.token = result.data as string
        // 本地持久化存储一份
        SET_TOKEN(result.data as string) // localStorage.setItem('TOKEN', result.data.token as string)
        // return ok能保证当前async函数能返回一个成功的promise
        return 'ok'
      } else {
        // 返回一个失败的promise【目的为了组件能够判断是否登录成功】
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息 和上面一样 reqUserInfo返回的是promise对象，需要async和await
    async userInfo() {
      // 获取用户信息存储仓库中[用户头像，用户名]
      const result: userInfoResponseData = await reqUserInfo()
      // console.log(result.data)
      // 将获取到的信息存到state中
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        // 菜单路由权限的实现
        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )

        //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // 此时userAsyncRoute, anyRoute虽然已经添加到了menuRoutes中
        // 但是其中的路由并没有被路由器管理，所以让然需要添加到路由中，否则点击菜单不能跳转到对应路由组件
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })

        // 返回一个成功的promise对象
        return 'ok'
      } else {
        // 返回一个失败的promise
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      //退出登录请求
      const result: any = await reqLogout()
      if (result.code == 200) {
        //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
        // 清空仓库用户数据
        this.token = ''
        this.username = ''
        this.avatar = ''
        // 清空本地存储token
        REMOVE_TOKEN()
        return 'ok'
      } else {
        // 退出登录失败
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
export default useUserStore
