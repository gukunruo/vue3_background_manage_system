<template>
  <te class="layout_container">
    <!-- 1 左侧菜单 -->
    <div
      class="layout_slider"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <!-- 顶部logo -->
      <Logo></Logo>
      <!-- 展示菜单 滚动组件中放菜单组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 滚动条中设置菜单 -->
        <el-menu
          :default-active="$route.path"
          background-color="#001529"
          text-color="aliceblue"
          :collapse="LayoutSettingStore.fold"
        >
          <!-- 根据路由动态生成的菜单 将userStore数据menuRoutes传给Menu子组件使用 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 2 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <!-- layout顶部导航下tabbar -->
      <Tabbar></Tabbar>
    </div>
    <!-- 3 内容展示区 -->
    <div
      class="layout_main"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </te>
</template>

<script setup lang="ts">
// 引入组合式api【将同类的放一块】函数之生命周期钩子函数
// import { onMounted } from 'vue'
// 引入当前路由组件实例
import { useRoute } from 'vue-router'
// 引入logog组件
import Logo from './logo/index.vue'
// 引入递归组件生成的菜单
import Menu from './menu/index.vue'
// 引入封装的router-view
import Main from './main/index.vue'
// 引入tabbar组件
import Tabbar from './tabbar/index.vue'
// 获取用户小仓库中的路由数组数据
import useUserStore from '@/store/modules/user'
// 获取layout组件相关配置的小仓库
import useLayoutSettingStore from '@/store/modules/setting'
let userStore = useUserStore() // 然后将userStore数据menuRoutes传给Menu子组件
let LayoutSettingStore = useLayoutSettingStore()
// 注册组件实例
let $route = useRoute()

// 目前首页挂载完毕发请求获取用户信息 将发送请求放到了路由守卫permission.ts中
/* onMounted(() => {
  userStore.userInfo()
}) */
</script>

<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Layout',
}
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100%;
    background: $base-menu-background;
    color: white;
    // 给菜单折叠添加过渡动画
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
    // &.fold = 同时包含.layout_slider和.fold
    &.fold {
      width: $base-menu-min-width;
    }
  }
  /* .fold {
    width: 49px;
  } */
  .layout_tabbar {
    // 定位到头部
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    // 给菜单折叠添加过渡动画
    transition: all 0.3s;
    &.fold {
      left: $base-menu-min-width;
      width: calc(100vw - $base-menu-min-width);
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    // 滚动
    overflow: scroll;
    // 给菜单折叠添加过渡动画
    transition: all 0.3s;
    &.fold {
      left: $base-menu-min-width;
      width: calc(100vw - $base-menu-min-width);
    }
  }
}
</style>
