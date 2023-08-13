<template>
  <div class="box" ref="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import * as chinaJSON from './china.json'
//获取DOM元素
let map = ref()
// 注册中国地图echarts.registerMap 参数1 地图名 参数2 配置对象[包含地图数据]
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  // 引入航线所用的飞机箭头 用于symbol属性
  const planePath =
    'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'
  let myEcharts = echarts.init(map.value)
  myEcharts.setOption({
    // geo地理坐标系组件 支持在地理坐标系上绘制散点图，线集
    geo: {
      map: 'china', // 中国地图
      roam: true, // 是否开启放大缩小/拖拽功能
      //地图的位置调试
      left: 150,
      top: 120,
      right: 150,
      bottom: 0,
      // 缩放比列
      zoom: 1.12,
      // 地图中心点位置
      layoutCenter: ['50%', '50%'],
      //地图上的文字的设置
      label: {
        show: true,
        color: 'white',
        fontSize: 14,
      },
      // itemStyle地图区域的多边形 图形样式
      itemStyle: {
        areaColor: '#12235c', // 地图区域的颜色
        // borderColor: '#2ab8ff', // 图形的描边颜色
        borderColor: 'rgba(147, 235, 248, 1)',
        borderWidth: 0.8,
        shadowColor: 'rgba(128, 217, 248, .8)',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
        opacity: 0.9,
      },
      //地图高亮的效果
      emphasis: {
        label: {
          color: 'white',
          fontSize: 32,
          // fontWeight: 'bold',
        },
        itemStyle: {
          // areaColor: '#5470c6',
          borderWidth: 2,
          borderType: 'dashed', // 高亮时虚线边框
        },
        // focus: 'self', // 鼠标移入地区，其余地区淡出
      },
    },
    //布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    // 航线的设置 series-lines
    series: [
      {
        type: 'lines', //航线的系列
        data: [
          {
            // 北京->河南
            coords: [
              [116.405285, 39.904989], // 起点
              [113.665412, 34.757975], // 终点
            ],
          },
          {
            // 河南->北京
            coords: [
              [113.665412, 34.757975],
              [116.405285, 39.904989],
            ],
          },
          {
            // 北京->黑龙江
            coords: [
              [116.405285, 39.904989],
              [126.642464, 45.756967],
            ],
          },
          {
            // 黑龙江->北京
            coords: [
              [126.642464, 45.756967],
              [116.405285, 39.904989],
            ],
          },
          {
            // 河南->浙江
            coords: [
              [113.665412, 34.757975],
              [120.153576, 30.287459],
            ],
          },
          {
            // 浙江->河南
            coords: [
              [120.153576, 30.287459],
              [113.665412, 34.757975],
            ],
          },
          {
            // 浙江->台湾
            coords: [
              [120.153576, 30.287459],
              [121.509062, 25.044332],
            ],
          },
          {
            // 北京->新疆
            coords: [
              [116.405285, 39.904989],
              [87.617733, 43.792818],
            ],
          },
          {
            // 新疆->北京
            coords: [
              [87.617733, 43.792818],
              [116.405285, 39.904989],
            ],
          },
          {
            // 河南->四川
            coords: [
              [113.665412, 34.757975],
              [104.065735, 30.659462],
            ],
          },
          {
            // 四川->河南
            coords: [
              [104.065735, 30.659462],
              [113.665412, 34.757975],
            ],
          },
          {
            // 四川->西藏
            coords: [
              [104.065735, 30.659462],
              [91.132212, 29.660361],
            ],
          },
          {
            // 四川->广东
            coords: [
              [104.065735, 30.659462],
              [113.280637, 23.125178],
            ],
          },
          {
            // 广东->四川
            coords: [
              [113.280637, 23.125178],
              [104.065735, 30.659462],
            ],
          },
        ],
        // 开启动画特效
        effect: {
          show: true,
          period: 5, // 箭头指向速度，值越小速度越快
          trailLength: 0, // 特效尾迹长度[0,1]值越大，尾迹越长重
          // symbol: 'arrow', // 箭头图标
          symbol: planePath, // 箭头图标使用引入的箭头
          symbolSize: 18,
        },
        // 线路统一的样式设置
        lineStyle: {
          color: '#00eaff',
          width: 1.5, //尾迹线条宽度
          opacity: 0.7, //尾迹线条透明度
          curveness: 0.3, //尾迹线条曲直度
        },
      },
    ],
  })
})
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'ChinaMap',
}
</script>

<style scoped lang="scss"></style>
