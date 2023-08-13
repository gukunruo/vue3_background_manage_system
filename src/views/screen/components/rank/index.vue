<template>
  <div class="box">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="topBar">
      <div class="bg">
        <span class="p1">排名</span>
        <span class="p2">景区</span>
        <span class="p3">预约数量</span>
      </div>
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
  let axisData = ['清明上河园', '北京故宫', '万里长城', '九寨沟', '稻城亚丁']
  let seriesData = [36474, 44732, 61901, 74885, 84912]
  // 下面的颜色用于给不同的进度条赋不同的颜色
  // let linerColor = ['rgba(161, 15, 239, 1)', 'rgba(0, 0, 0, 0)']
  let myColor = [
    'DeepSkyBlue',
    'hotpink',
    'Aquamarine',
    'OrangeRed',
    'MediumSeaGreen',
    'MediumSlateBlue',
    'CornflowerBlue',
    'Green',
    'DodgerBlue',
    'LightPink',
  ]
  let option = {
    // 设置echarts位置
    grid: {
      left: '8%',
      top: '24%',
      right: '15%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: {
      show: false,
    },
    yAxis: [
      {
        inverse: true, // 是否是反向坐标轴
        // 去掉坐标轴刻度和轴线
        axisTick: 'none',
        axisLine: 'none',
        // Y 轴相对于默认位置的偏移
        offset: '5',
        // 坐标轴刻度标签的相关设置 景区数据
        axisLabel: {
          interval: 0, // 坐标轴刻度标签的显示间隔
          textStyle: {
            color: '#ffffff',
            fontSize: '24',
            fontWeight: 'bold',
            fontFamily: 'siyuan',
          },
          formatter: function (value: any, index: any) {
            return (
              '{rank' + '|' + 'Top' + (1 + index) + '}{title|' + value + '}'
            )
          },
          // 自定义富文本样式 景区数据
          rich: {
            rank: {
              color: '#0AE3FF',
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: 'siyuan',
            },
            title: {
              color: '#fff',
              align: 'center',
              width: 130,
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: 'siyuan',
            },
          },
        },
        data: axisData,
      },
      {
        inverse: true, // 是否是反向坐标轴
        axisTick: 'none',
        axisLine: 'none',
        offset: '27',
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: '0',
          },
        },
        data: [10, 9, 8, 7, 6],
      },
    ],
    series: [
      {
        name: '条',
        type: 'bar', // 条状
        yAxisIndex: 0, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        //柱状图自动排序，排序自动让Y轴名字跟着数据动
        realtimeSort: true, // 开启实时排序，如果数据实时改变排行榜也会实时改变
        data: seriesData,
        // 文本标签，用于显示预约数量
        label: {
          // offset: '27',
          // distance:10,
          normal: {
            show: true,
            position: 'inside',
            // distance: 10, // 距离图形元素的距离
            textStyle: {
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'siyuan',
            },
          },
        },
        // 柱条的宽度
        barWidth: 16,
        itemStyle: {
          normal: {
            barBorderRadius: [30, 30, 30, 30],
            color: function (params: any) {
              let num = myColor.length
              return myColor[params.dataIndex % num]
            },
          },
        },
        z: 3,
      },
      {
        type: 'bar',
        data: [100000, 100000, 100000, 100000, 100000],
        yAxisIndex: 0,
        //调整柱条位置为背景
        barGap: '-100%',
        // 柱条的宽度
        barWidth: 20,
        itemStyle: {
          normal: {
            barBorderRadius: [30, 30, 30, 30],
            color: '#fff0',
            borderColor: 'skyblue',
          },
        },
        label: {
          show: true,
          position: 'right',
          distance: 10,
          textStyle: {
            color: '#fff',
            fontSize: 17,
            fontWeight: 'bold',
            fontFamily: 'siyuan',
          },
        },
        z: 2,
      },
    ],
  }
  myEcharts.setOption(option)
})
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Rank',
}
</script>

<style scoped lang="scss">
.box {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-rt.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 0px;
  color: white;
  font-size: 20px;

  .title {
    margin-left: 10px;
  }
  .topBar {
    position: absolute;
    top: 76px;
    left: 15px;
    width: 94%;
    .bg {
      display: flex;
      justify-content: space-between;
      text-align: center;
      background: url(../../images/rankingChart-bg.png) no-repeat;
      background-size: 100% 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      color: #ffb700;
      font-size: 22px;
      font-weight: bold;
      .p1 {
        flex: 1;
      }
      .p2 {
        flex: 1;
      }
      .p3 {
        flex: 3;
      }
    }
  }
  .chart {
    height: calc(100% - 30px);
  }
}
</style>
