<template>
  <div class="box">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" />
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
    // 提示框组件
    tooltip: {
      trigger: 'item',
    },
    // legend图例组件
    legend: {
      // 通过四个方向的属性调整具体的位置
      top: 50,
      right: 40,
      //调整图例组件方向
      orient: 'vertical', // 默认为水平，设置为竖直方向
      // 设置图例组件文字样式
      textStyle: {
        color: 'white',
        fontSize: 16,
      },
    },
    series: [
      {
        name: '年龄比例',
        type: 'pie',
        radius: ['44%', '76%'], // 设置圆环的大小 参数1是内环的大小 参数2为外环大小
        avoidLabelOverlap: false,
        // 设置边框样式
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        // label饼图图形上的文本标签 饼图上的文字显示
        label: {
          show: true, // 默认情况显示 false时指向才会显示 true直接就能显示
          position: 'inside', // 文字显示在饼图内部
          color: 'white',
          fontSize: 14,
        },
        // emphasis 高亮状态的扇区和标签样式 指向对应的图标高亮突出显示
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        // 展示的数据
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' },
        ],
      },
    ],
    //调整图形图标的位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  }
  myEcharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    color: white;
    margin-left: 20px;
    font-size: 20px;
  }
  .chart {
    height: 260px;
  }
}
</style>
