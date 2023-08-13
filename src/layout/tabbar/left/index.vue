<template>
  <!-- 左侧图标 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component
      :is="LayoutSettingStore.fold ? 'Expand' : 'Fold'"
      style="cursor: pointer"
    ></component>
  </el-icon>
  <!-- 面包屑 separator为分隔符 separator-icon图标分隔符的组件或组件名  -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示名字和标题 
      控制是否显示时有v-for就不要使用v-if，因为v-if优先级更高
      to属性可以选择string形式item.path和下面使用的对象形式 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      :to="{ path: item.path }"
      v-show="item.meta.title"
    >
      <!-- 图标 -->
      <el-icon style="margin: 0px 5px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// 引入路由获取当前组件路由对象
import { useRoute } from 'vue-router'
// 引入layout配置相关的小仓库并获取
import useLayoutSettingStore from '@/store/modules/setting'
let LayoutSettingStore = useLayoutSettingStore()
let $route = useRoute()
// 点击修改图标
const changeIcon = () => {
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>

<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Left',
}
</script>

<style scoped lang="scss"></style>
