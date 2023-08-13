<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Left></Left>
    </div>
    <div class="tabbar_right">
      <Right></Right>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧组件和右侧组件
import Left from './left/index.vue'
import Right from './right/index.vue'
</script>

<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  // 开启弹性盒，tabbar_left和right分两边排列
  display: flex;
  justify-content: space-between; // 主轴
  align-items: center;
  /* background-image: linear-gradient(
    to right,
    white,
    rgba(0, 195, 255, 0.4),
    rgb(95, 95, 225, 0.5)
  ); */
  .tabbar_left {
    display: flex;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
