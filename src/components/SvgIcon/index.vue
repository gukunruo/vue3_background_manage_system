<!-- 封装svg矢量图标全局组件 -->
<template>
  <svg :style="{ width: width, height: height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 接收到父组件传来的参数 动态绑定到template模板中
defineProps({
  // prefix：href的前缀，name为矢量图名，color填充颜色，width、height矢量图宽高
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: String,
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style lang="scss" scoped></style>
