<template>
  <div class="top">
    <div class="left">
      <span class="leftBtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rightBtn">统计报告</span>
      <!-- 使用时间的插件moment -->
      <span class="time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入插件moment
import moment from 'moment'
// 引入路由器对象
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 获取路由器对象
let $router = useRouter()
// 按钮的点击回调
const goHome = () => {
  $router.push('/home')
}
// 使用moment插件获取时间
let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
// timer用于给定时器命名拿到定时器对象 然后在组件销毁时清除
let timer = ref(0)
// 然后需要设置一个定时器不断去获取时间并更新
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
  }, 1000)
})
// 然后在组件销毁时清除定时器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Top',
}
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 40px;
  // 设置浮动然后水平显示三块内容
  display: flex;

  .left {
    flex: 1.5;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;

    .leftBtn {
      width: 150px;
      height: 40px;
      float: right;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }
  }
  .center {
    flex: 2;

    .title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 30px;
    }
  }
  .right {
    flex: 1.5;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    // 主轴方向的对其方式
    justify-content: space-between;
    // align-items 定义flex子项在flex容器的当前主轴的侧轴（纵轴）方向上的对齐方式
    align-items: center;
    .rightBtn {
      width: 150px;
      height: 40px;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }
    .time {
      color: #29fcff;
      font-size: 20px;
    }
  }
}
</style>
