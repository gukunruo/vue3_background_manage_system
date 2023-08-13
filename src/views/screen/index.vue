<template>
  <!-- 外边盒子 -->
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top />
      </div>
      <!-- 数据大屏主体部分 -->
      <div class="body">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <ChinaMap class="chinaMap"></ChinaMap>
          <TrendChart class="trendChart"></TrendChart>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="count"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入顶部的子组件
import Top from './components/top/index.vue'
//引入左侧三个子组件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
//引入中间两个子组件
import ChinaMap from './components/map/index.vue'
import TrendChart from './components/line/index.vue'
//引入右侧三个子组件
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'
// 获取数据大屏展示内容盒子的DOM元素
let screen = ref()
// 挂载时首先去获取视口的宽高
onMounted(() => {
  // 使用ref获取到的dom对象调用时都需要带.value
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
// 创建函数
function getScale(w = 1920, h = 1080) {
  let ww = window.innerWidth / w
  let wh = window.innerHeight / h
  // 按照变化较小者的比例去进行缩放
  return ww < wh ? ww : wh
}
// 视口发生变化时
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  // 大屏的响应式使用transform的scale属性去实现
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    // 将transform的基准点改为左上角
    transform-origin: left top;
    // 然后将整体往右下角移50%
    left: 50%;
    top: 50%;
    .top {
      width: 100%;
      height: 40px;
    }
    .body {
      // 让主体部分左中右三部分进行浮动
      display: flex;
      height: 1040px;
      .left {
        // 设置弹性盒的flex属性可以设置弹性盒元素之间的比例大小
        flex: 1;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        .chinaMap {
          flex: 4;
        }
        .trendChart {
          flex: 1;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        // margin-left: 40px;
        .rank {
          flex: 1.5;
        }
        .year {
          flex: 1;
        }
        .count {
          flex: 1;
        }
      }
    }
  }
}
</style>
