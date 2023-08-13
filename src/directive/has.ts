// 创建自定义指令 app.directive
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
// 需要传入大仓库pinia
const userStore = useUserStore(pinia)
// 将这个函数在入口文件中引入
const isHasButton = (app: any) => {
  //全局自定义指令:实现按钮的权限
  app.directive('has', {
    // 代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    // 全局自定义指令能够拿到指令里的值，然后拿到它进行判断仓库中的buttons数组中是否有这个按钮的权限
    mounted(el: any, options: any) {
      // el就是使用这个指令的dom元素 option对象中的value属性就是绑定的值
      // 如果仓库中的buttons数组中没有则将其从DOM树父元素上删掉
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
export default isHasButton
