import { createApp } from 'vue'
import App from '@/App.vue'
// 完整引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化 为中文【因为这个文件没有ts类型的声明，所以会报红】
// 使用下面@ts-ignore表示忽略ts类型检测，否则下面代码打包时会报错
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入暗黑模式的样式文件
import 'element-plus/theme-chalk/dark/css-vars.css'
// svg插件需要配置的代码
import 'virtual:svg-icons-register'
// 引入并安装自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components/index'
// 引入模板全局样式
import '@/styles/index.scss'
// 引入路由配置文件
import router from '@/router/index'
// 引入仓库pinia
import pinia from '@/store/index'

// 获取应用实例对象app
const app = createApp(App)
// 使用ElementPlus组件(安装插件到app实例)
app.use(ElementPlus, {
  // 配置element-plus中文
  locale: zhCn,
})
app.use(globalComponent)
// 注册模板路由
app.use(router)
// 引入路由鉴权的文件
import './permission'
// 安装仓库
app.use(pinia)

// 引入自定义指令
import isHasButton from './directive/has'
isHasButton(app)

// 将应用挂载到挂载点
app.mount('#app')
