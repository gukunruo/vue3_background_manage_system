// 通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入路由配置 常量路由
import { constantRoute } from './routes'
// 创建路由器
const router = createRouter({
  // 路由模式默认为hash[引入createWebHashHistory] 如果想要为history模式的化引入createWebHistory
  history: createWebHashHistory(),
  // 配置路由 配置好之后将路由配置数组单独创建成一个文件然后引入
  routes: constantRoute,
  // 添加滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
export default router
// 配置完路由在入口文件引入
