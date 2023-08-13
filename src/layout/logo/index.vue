<template>
  <div class="logo" v-if="!setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p v-show="!LayoutSettingStore.fold">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting.ts'
// 获取layout组件相关配置的小仓库
import useLayoutSettingStore from '@/store/modules/setting'
let LayoutSettingStore = useLayoutSettingStore()
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  // 开启浮动 水平居中
  align-items: center;
  img {
    width: 38px;
    height: 38px;
    margin: 0 12px;
    // border: 1px rgba(255, 255, 255, 0.5) solid;
    border-radius: 50%;
  }
  p {
    font-size: $base-logo-title-fontsize;
  }
}
</style>
