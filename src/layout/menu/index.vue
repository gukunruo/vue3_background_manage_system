<template>
  <!-- 将路由数组进行递归遍历  -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 当路由没有children -->
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 当路由children且只有一个child 只显示这一个children即可 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 当路由children且child数量大于1 -->
    <template v-if="item.children && item.children.length > 1">
      <el-sub-menu v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts">
// import Menu from './index.vue'
// 引入路由实例对象 等同于vue2中的$router
import { useRouter } from 'vue-router'
let $router = useRouter()
// 获取父组件layout传来的menuList=userStore.menuRoutes【user小仓库中的路由数组】
defineProps(['menuList'])
// 点击菜单的回调 注入vc实例
const goRoute = (vc: any) => {
  // console.log(vc.index) // vc实例中的index属性【el-menu-item绑定的唯一标识】就是我们路由的path路径
  $router.push(vc.index) // 利用编程式路由导航go push replace
}
</script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Menu',
}
</script>

<style scoped lang="scss"></style>
