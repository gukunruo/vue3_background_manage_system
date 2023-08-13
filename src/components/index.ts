// 自定义插件：将所有全局组件注册到这作为一个插件 然后对外暴露
// 引入项目中所有的全局注册组件
import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
// 引入@element-plus/icons-vue 全局注册图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { App, Component } from 'vue'
const allGlobalComponents: { [name: string]: Component } = { SvgIcon, Category }
export default {
  // 插件对象有一个install方法
  install(app: App) {
    // 遍历所有的全局注册组件 分别使用app.component进行全局注册
    Object.keys(allGlobalComponents).forEach((key: string) => {
      // console.log(key) // key = SvgIcon
      app.component(key, allGlobalComponents[key])
    })
    // ElementPlusIconsVue 图标对象，身上包含二百多个图标
    // 将其身上所有图标注册位全局组件【element-plus提供的模板】
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
