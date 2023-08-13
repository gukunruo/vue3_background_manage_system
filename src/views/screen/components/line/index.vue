<template>
  <div class="box">
    <div class="title">
      <p>未来三十天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
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
  let myEcharts = echarts.init(echart.value)
  let option = {
    // 标题组件
    title: {
      text: '访问量',
      textStyle: {
        color: '#fffc',
        fontSize: 18,
      },
      padding: [15, 0, 0, 65],
    },
    // x|y轴
    xAxis: {
      // 类目轴，适用于离散的类目数据
      type: 'category',
      // boundaryGap坐标轴两边留白策略
      boundaryGap: false,
      // 分割线不要
      splitLine: false,
      // x轴参数取值
      data: [
        '1',
        '3',
        '5',
        '7',
        '9',
        '11',
        '13',
        '15',
        '17',
        '19',
        '21',
        '23',
        '25',
        '27',
        '29',
      ],
      // 轴线的设置
      axisLine: {
        show: true,
        // 设置轴线的样式
        lineStyle: {
          // 轴线颜色和对应字体颜色
          color: '#fffa',
        },
      },
      // 刻度
      axisTick: {
        show: true,
        // 刻度线的长度
        length: 5,
        // 设置刻度样式
        lineStyle: {
          color: '#fffa',
        },
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      // 轴线的设置
      axisLine: {
        show: true,
        // 设置轴线的样式
        lineStyle: {
          // 轴线颜色和对应字体颜色
          color: '#fffa',
        },
      },
      // 刻度
      axisTick: {
        show: true,
        // 刻度线的长度
        length: 5,
        // 设置刻度样式
        lineStyle: {
          color: '#fffa',
        },
      },
    },
    //调整图形图标的位置
    grid: {
      left: 55,
      top: 20,
      right: 20,
      bottom: 20,
    },
    //系列
    series: [
      {
        type: 'line',
        data: [
          420, 800, 789, 1240, 432, 2201, 66, 1699, 321, 890, 1200, 200, 900,
          800, 420, 20, 2123, 104, 412, 1332, 1201, 266, 2299, 21, 890, 1204,
          521, 888, 530, 620,
        ],
        // 平滑曲线的设置
        smooth: true,
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0.3,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 230, 0, 0.54)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(255, 230, 0, 0)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  }
  myEcharts.setOption(option)
})
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'TrendChart', // 趋势图
}
</script>

<style scoped lang="scss">
.box {
  width: 95%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 20px;
  color: white;
  font-size: 20px;

  .title {
    margin-left: 10px;
  }
  .chart {
    height: calc(100% - 40px);
  }
}
</style>
