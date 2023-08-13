<template>
  <!-- 右侧按钮 -->
  <!-- circle是原型图标 -->
  <el-button icon="Refresh" title="刷新" circle @click="refresh"></el-button>
  <el-button
    icon="FullScreen"
    title="全屏"
    circle
    @click="fullScreen"
  ></el-button>
  <!-- 设置 -->
  <!-- 弹出框 popover
      placement 弹出框出现位置  width 宽度  trigger 触发方式[默认hover] -->
  <el-popover title="主题设置" width="260px" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <!-- 
          取色器：
            自定义事件change 颜色变化触发的函数
            model-value / v-model	选中项绑定值
            show-alpha	是否支持透明度选择
            predefine	预定义颜色 -->
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <!-- 
          开关组件：
            change	switch 状态发生变化时的回调函数
            model-value / v-model	开关的值
            inline-prompt	将active-icon设置的的图标或字体等放到开关中
            active-icon/inactive-icon[开关中图标设置]	switch状态为 on/off 时所显示图标，设置此项会忽略active-text/inactive-text
         -->
        <el-switch
          @change="changeDark"
          v-model="dark"
          style="margin-left: 24px"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <!-- 触发弹出框的html结构 -->
    <template #reference>
      <el-button icon="Setting" title="设置" circle></el-button>
    </template>
  </el-popover>
  <!-- 头像 -->
  <img
    :src="userStore.avatar"
    style="width: 30px; height: 30px; border-radius: 50%; margin: 0px 15px"
    alt=""
  />
  <!-- 下拉菜单退出登录 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <!-- 具名插槽 -->
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 引入路由器对象
import { useRouter, useRoute } from 'vue-router'
// 引入layout配置相关的小仓库并获取
import useLayoutSettingStore from '@/store/modules/setting'
// 获取user.ts小仓库
import useUserStore from '@/store/modules/user.ts'
let LayoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
// 创建路由器对象以及路由对象
let $router = useRouter()
let $route = useRoute()

// 刷新按钮点击回调refresh
const refresh = () => {
  LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}
const fullScreen = () => {
  // document.fullscreenElement判断当前项目是不是全屏 返回一个布尔值 全屏true
  let full = document.fullscreenElement
  if (!full) {
    // 利用文档的根节点的方法requestFullscreen请求全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
// 退出登录
const logout = async () => {
  // 第一件事：向服务器发送请求，告知token无效
  // 第二件事：仓库中关于用户相关数据清空
  // 第三件事：跳转到登录页面
  await userStore.userLogout()
  // 使用路由器对象$router路由跳转到登录界面[编程式路由导航]
  $router.push({ path: '/login', query: { redirect: $route.path } }) // 携带query参数可以保存从哪退出的页面
}

// 取色器颜色变量 收集取色器颜色值
const color = ref('rgba(255, 69, 0, 0.68)')
// 设置预定义的颜色
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 主题颜色的切换
const setColor = () => {
  // 通知js修改根节点的样式对象的属性与属性值
  // document.documentElement返回文档对象（document）的根元素的只读属性
  const html = document.documentElement
  // CSSStyleDeclaration.setProperty() 方法接口为一个声明了 CSS 样式的对象设置一个新的值
  html.style.setProperty('--el-color-primary', color.value)
}

// 收集开关的数据
let dark = ref<boolean>(false)
// switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}
</script>

<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Right',
}
</script>

<style scoped lang="scss"></style>
