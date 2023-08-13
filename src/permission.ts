//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from './router'
import setting from './setting'
// 引入进度条插件 因为是js文件 没有ts声明 下载@types/nprogress
import * as nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 关闭进度条带的加载圆圈
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/user'
// let userStore = useUserStore() // Did you forget to install pinia?
import pinia from './store'
// 传入大仓库，因为组件的外部通过同步方式拿到仓库数据是拿不到的，需要引入大仓库
const userStore = useUserStore(pinia)
//全局守卫:项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  // 通过dom操作添加页面的标题
  document.title = `${setting.title} - ${to.meta.title}`
  //to:你将要访问那个路由
  //from:你从来个路由而来
  //next:路由的放行函数
  nprogress.start()
  // 获取token,去判断用户登录、还是未登录
  const token = userStore.token
  // 获取用户的名字
  const username = userStore.username
  //用户登录判断
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功访问其余六个路由(登录排除)
      //有用户信息
      if (username) {
        //放行
        next()
      } else {
        //如果没有用户信息，在守卫这里发请求获取到了用户信息再放行
        try {
          //获取用户信息 userInfo定义时前面有async的异步方法，返回promise对象
          await userStore.userInfo()
          //放行
          //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({ ...to })
        } catch (error) {
          //两种情况：1 有token但过期:获取不到用户信息了； 2 用户手动修改本地存储token
          //退出登录->用户相关的数据清空
          await userStore.userLogout()
          // 携带退出登录时的路径通过query参数携带到url中
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      // 如果未登录时前往的不是login，则使用next定向到login，并将想去的路径通过query参数携带在路径后面
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫 参数to: any, from: any
router.afterEach(() => {
  nprogress.done()
})

//第一个问题:任意路由切换实现进度条业务 ---nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理acl(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[指向首页],其余的路由可以访问
