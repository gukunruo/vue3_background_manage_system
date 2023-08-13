<template>
  <div class="box">
    <div class="top">
      <p>实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 水球图 插件echarts-liquidfill -->
    <div class="echarts" ref="echart"></div>
  </div>
</template>

<script setup lang="ts">
// 引入echarts
import * as echarts from 'echarts'
// 水球图 插件echarts-liquidfill
import 'echarts-liquidfill'
import { ref, onMounted } from 'vue'
// 静态人数[目前没有api]
let people = ref('234468人')

// 拿到用于放echart的dom对象
let echart = ref()
// 组件挂载完毕时可以拿到echart这个dom元素
onMounted(() => {
  // 初始化echarts
  // 首先先获取echarts类的实例 调用echarts.init方法 挂载到存放echarts的dom元素身上 会返回一个实例
  let myEcharts = echarts.init(echart.value)
  // 设置实例的配置项
  myEcharts.setOption({
    // 标题组件
    title: {
      text: '水球图',
    },
    // x|y轴组件
    xAxis: {},
    yAxis: {},
    // 系列:决定你展示什么样的图形图标
    series: {
      type: 'liquidFill', // 系列-水球图
      data: [0.6, 0.4, 0.2], // 展示的数据 个数为波浪的条数 值为波浪的高度
      waveAnimation: true, // 动画 默认为true
      animationDuration: 3, // 动画时间 不写animationDuration的话波浪会从下到上出现
      animationDurationUpdate: 0,
      radius: '100%', // 半径 默认为50%
      // 外边层样式
      outline: {
        //外层边框颜色设置
        show: true, // 默认为true
        borderDistance: 8, // 内边框的宽度，默认为8
        // 样式
        itemStyle: {
          color: 'skyblue', // 内边框的颜色
          borderColor: '#294D99', // 外边框的颜色
          borderWidth: 8, // 外边框的宽度
          // 设置阴影
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
    // 网格[坐标轴]
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Tourist',
}
</script>

<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lt.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    color: white;
    font-size: 20px;
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      // 开启右浮动
      float: right;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    padding: 10px;
    margin-top: 20px;
    // 让每个数字进行浮动，且各占一份
    display: flex;
    span {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }
  .echarts {
    width: 100%;
    height: 270px;
    margin-bottom: 10px;
  }
}
</style>
