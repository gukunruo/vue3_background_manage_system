<template>
  <div class="box">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" />
      </div>
      <div class="woman">
        <img src="../../images/woman.png" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <!-- 图形图标的容器 -->
    <div class="chart" ref="echart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
// 拿到echart挂载实例
let echart = ref()
onMounted(() => {
  // 初始化echarts实例
  let myEcharts = echarts.init(echart.value)
  // 设置配置项
  myEcharts.setOption({
    // 组件标题
    title: {
      text: '男女比例', // 主标题
      textStyle: {
        // 主标题颜色
        color: 'skyblue',
      },
      left: '42%',
    },
    // x|y轴组件
    xAxis: {
      show: false, // 是否显示 x 轴
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      // 坐标轴类型 category类目轴，适用于离散的类目数据
      type: 'category', // 让柱状图在x轴分布
    },
    // 系列：决定你展示什么样的图形图标
    series: [
      {
        type: 'bar', // 柱状图
        data: [58],
        barWidth: 20, // 进度条的宽度
        z: 9, // 层级 置于粉色进度条的顶部
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        //调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: '#ff4b7a',
          borderRadius: 20,
        },
      },
    ],
    // 设置grid四个属性都为0 可以让图形图表和挂载点宽高一致
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Sex',
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lc.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  color: white;

  .title {
    margin-left: 20px;
    font-size: 20px;
  }

  .sex {
    display: flex;
    justify-content: center;
    // margin-top: 10px;

    .man {
      width: 111px;
      height: 115px;
      margin: 20px;
      background: url(../../images/man-bg.png) no-repeat;
      // 让头像处于这个图像框的中间
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .woman {
      width: 111px;
      height: 115px;
      margin: 20px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
  }

  .chart {
    height: 100px;
  }
}
</style>
