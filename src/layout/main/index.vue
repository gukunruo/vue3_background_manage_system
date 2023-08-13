<!-- 将展示路由位置的 router-view 标签单独封装成组件，然后方便给其添加过渡动画等 -->
<template>
  <!-- 路由组件出口的位置 通过插槽引入组件 -->
  <router-view v-slot="{ Component }">
    <Transition name="fade">
      <!-- 渲染layout一级路由组件子路由 目前实现的效果和我们不添加动画是一样的，只是方便自定义 -->
      <component :is="Component" v-if="flag"></component>
    </Transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
// 引入layout配置相关的小仓库并获取
import useLayoutSettingStore from '@/store/modules/setting'
let LayoutSettingStore = useLayoutSettingStore()

// 控制当前组件是否销毁重建
let flag = ref(true)

// 监听仓库内部数据是否发生变化，发生变化则说明用户点击过刷新按钮
watch(
  () => LayoutSettingStore.refresh,
  () => {
    // 点击刷新按钮：路由组件销毁
    flag.value = false
    // 不要使用延时器恢复渲染，不靠谱，使用nextTick更好
    // nextTick：DOM 更新循环结束之后执行延迟回调，可以确保正确地获取更新后的 DOM。
    nextTick(() => {
      // 将上面代码执行完后也就是component组件销毁完成之后再执行这里的代码，然后再将组件重新渲染
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Main',
}
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0); // scale 按比例缩小的 用于缩放 0为没有 1为正常大小
}
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
