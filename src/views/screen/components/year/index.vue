<template>
  <div class="box">
    <div class="title">
      <p>年度游客量对比</p>
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
    color: ['#5090FF', '#01B3E4', '#FF7E00', '#99004c'],
    // 提示框组件 悬浮提示
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,.6)',
      borderColor: 'rgba(147, 235, 248, .8)',
      textStyle: {
        color: '#FFF',
      },
    },
    // 直角坐标系内绘图网格 设置echarts位置
    grid: {
      left: '2%',
      right: '5%',
      bottom: '5%',
      top: '50px',
      // grid 区域是否包含坐标轴的刻度标签
      containLabel: true,
    },
    // 图例组件 右上角的提示
    legend: {
      show: true,
      icon: 'rect', // rect矩形
      orient: 'horizontal',
      // left图例组件离容器左侧的距离 可以是具体值或者'left', 'center', 'right'
      left: 'right',
      itemWidth: 12,
      itemHeight: 12,
      formatter: ['{a|{name}}'].join('\n'),
      textStyle: {
        fontSize: 12,
        color: '#6A93B9',
        height: 8,
        rich: {
          a: {
            verticalAlign: 'bottom',
          },
        },
      },
      data: ['2021年', '2022年', '2023年'],
    },
    xAxis: {
      type: 'category',
      // 坐标轴轴线
      axisLine: {
        lineStyle: {
          color: '#BDD8FB',
          fontSize: 12,
        },
      },
      // 坐标轴文本标签
      axisLabel: {
        // interval:0,
        color: '#BDD8FB',
        fontSize: 12,
      },
      // 坐标轴刻度
      axisTick: {
        show: false,
      },
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    yAxis: {
      name: '(人数)',
      type: 'value',
      min: 0,
      minInterval: 1, // 最小间隔
      // 坐标轴名称的文字样式
      nameTextStyle: {
        fontSize: 12,
        color: '#BDD8FB',
        align: 'center',
      },
      // 分割线
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)',
        },
      },
      splitArea: { show: false },
      // 坐标线
      axisLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
        fontFamily: 'Bebas',
        color: '#BDD8FB',
      },
    },
    // 系列配置
    series: [
      {
        type: 'line',
        smooth: true, // 是否曲线
        name: '2021年', // 图例对应类别
        data: [555, 432, 231, 524, 22, 132, 318, 32, 131, 484, 322, 32], // 纵坐标数据
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, //右
            y: 0, //下
            x2: 0, //左
            y2: 1, //上
            colorStops: [
              {
                offset: 0.1,
                color: '#5090FF', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#1057E500', // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        type: 'line',
        smooth: true,
        name: '2022年', // 图例对应类别
        data: [255, 432, 331, 254, 422, 232, 518, 132, 131, 284, 122, 432], // 纵坐标数据
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, //右
            y: 0, //下
            x2: 0, //左
            y2: 1, //上
            colorStops: [
              {
                offset: 0.1,
                color: '#01B3E4', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#86DCF300', // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        type: 'line',
        smooth: true,
        name: '2023年', // 图例对应类别
        data: [155, 332, 131, 24, 122, 432, 218, 332, 531, 284, 122, 282], // 纵坐标数据
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, //右
            y: 0, //下
            x2: 0, //左
            y2: 1, //上
            colorStops: [
              {
                offset: 0.1,
                color: '#FF7E00', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FF000000', // 100% 处的颜色
              },
            ],
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
  name: 'Year',
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-rc.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 0px;
  color: white;
  font-size: 20px;

  .title {
    margin-left: 10px;
  }
  .chart {
    height: calc(100% - 30px);
  }
}
</style>
