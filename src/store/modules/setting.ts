// 关于layout组件相关配置的小仓库
import { defineStore } from 'pinia'
// 选项式写法
const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 控制菜单折叠还是收起
      refresh: false, // 控制刷新效果
    }
  },
})
export default useLayoutSettingStore
