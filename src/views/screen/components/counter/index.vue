<template>
  <div class="box">
    <div class="title">
      <p>数据统计</p>
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
  let img1 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAADGCAYAAACJm/9dAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAE/9JREFUeJztnXmQVeWZxn/dIA2UgsriGmNNrEQNTqSio0IEFXeFkqi4kpngEhXjqMm4MIldkrE1bnGIMmPcUkOiIi6gJIragLKI0Songo5ZJlHGFTADaoRuhZ4/nnPmnO4+l+7bfc85d3l+VV18373n3Ptyvve53/5+da1L6jDdYjgwBhgNHALMBn6Sq0VdcxlwGvACsAx4HliTq0VlRlNzY+LrfTO2o5LoDxwOHAmMA/4WiP+KzM3DqCJpAA4K/i4F2oBXgWbgWWAxsDEv48oZC6M9Q4EJwInAMcDAfM0pOXXA14K/y4FPgQXAfOBxYF1+ppUXFgYMBiYCp6PaoU+B694HFqEmyVJgVSbW9Y6bgCeBb6Am4GHALrH3B6L/+0RgM6pFHgQeAzZkaWi5UVejfYx64AjgXOAk1OToSCtqajyFHGZlVsalzH7oB+BYJJR+Cde0oKbi3cBCYEtWxmVNoT5GrQljGHAecD7wxYT3P0bNirlIEB9lZ1ouDEICOQk1H7dLuOYt4C7gZ8Da7EzLhloXxv7AJcCZdK4dWpAIHkDt7FrtjA5A/aszkFiSntP9wAzgP7M1LT0KCaM+YzuyZixy+leAb9O+sN9AHdDd0S/mbGpXFKD/+2z0LHZHz+aN2PsN6Bm+gjrsY7M2MEuqVRhHoU7yYjS6FPI5MAc4FNgHzUN4JKYz69Cz2Qc9qzno2YUcjZ7t8iBddVSbMEYDzwFPA6Nir28Afgx8CZiERpVM91iKntnfoGcYH606BNUez6GRr6qhWoSxF/AoKsQxsdfXAj9AHe2rgNXZm1Y1/A96hl8E/pn2HfExwBJUBntlb1rpqXRhbA/cDLyGxuJDPgSuBPYErqPGx+RLzAagCT3bK9GzDpmIyuJmVDYVS6UKow74e+APwPeIxuI/AX6Emkw3opldkw6fome8F3rmnwSv90Nl8gdURhU57FmJwtgHdfx+jpZwgCag7gW+DFyDa4gsWY+e+ZdRGYSTgUNRGS1GZVZRVJIwtgF+iMbQ4/2IF4ADgHOA93Kwy4j3UBkcgMokZAwqsx+iMqwIKkUYI4AXgelEzab1wAVoNOSVnOwynXkFlckFqIxAZTYdleGInOwqinIXRh1wMfASMDL2+hxgb+BOqngdTwWzBZXN3qisQkaisryYMu97lLMwhgHzgJ+ivRGgIcJJwd8HOdllus8HROUVDu/2R2U6D5VxWVKuwjgEVcnjY689jqrhOYl3mHJmDiq7x2OvjUdlfEguFnVBOQrju2gmdbcgvwmYitbweFtm5bIGleFUVKagMn4OlXlZUU7C6A/MQqs3w9GLN4ADgZloW6apbNpQWR5ItEBxG1Tms4iazLlTLsLYCW2IOTv22iNor3Il7JQzxbEKle0jsdfORj6wUy4WdaAchDEC+A1RW3MzcAVwKtW/UaiW+QiV8RWozEE+8Bu0yzBX8hbGwaiNuUeQ/xi1Q2/CTadaoA2V9Umo7EG+8Dw57/fIUxhHAs8AOwb5t9Cy8fm5WWTyYj4q+7eC/PZoOfspeRmUlzBOBn4FbBvkX0XVaLUEHDDFsxL5wG+DfAOKWHJOHsbkIYwpaAtluLRjEdol5nVO5j20tmpRkO+DAjFclLUhWQvjUhSSJYzdNA84DneyTcRHyCfmBfk64HYUbjQzshTGVOBWojUys9GoREuGNpjKoAX5xuwgXwfcQoY1R1bCmILWx4SimAWcBXyW0febyuMz5COzgnxYc0zJ4suzEMZEFKwrFMVDKAzL5oJ3GCM2I195KMjXIV86Ke0vTlsYR6CRhbBPMReYjEVhus9mNCseRpfvg5pYR6T5pWkKYz8UNSIcfVqIzmpoTfE7TXXyGfKdhUG+H/Kt1GbI0xLGMODXKJI4aIz6m1gUpue0Ih8Kw4MORj6Wyp6ONITRADyBwjyC4hEdjwMUmN6zAUU+fDPI7458LSlafa9IQxh3oZWToP/ICcDbKXyPqU3WouDT4Q/tQcjnSkqphXEJ6lyDOk2T8TIPU3pW0n4QZzLyvZJRSmGMQislQ65C1ZwxafAEioQYchPt4xX3ilIJYygaaw5HoB5BM5XGpMmtwMNBuh/ywaGFL+8+pRBGHYpAF+7R/h2anfR+CpM2bWj1bbhNdjfki70OzVMKYVxEFM1jE955Z7Il3AkYHvoznhKsqeqtML6KIluHfB93tk32rEK+F3Iz8s0e0xth9EXVVhjZ4QkUAcKYPPg3orhV/YH76MVx3b0RxhXA3wXpdehoYPcrTF60oRN5w6PjDkQ+2iN6Kox9UOj3kAtxMDSTP2uQL4ZcA+zbkw/qiTDqULUVTsM/RDRkZkzePEy0TL0B+WrRo1Q9Eca3iEKbrKfEM47GlIBLgP8N0mPQyU5FUawwdqDz7Lajjpty4wPg6lj+RqIwTd2iWGE0Ei3zXUEKi7eMKRF3IR8F+ew1W7m2E8UI4ytEEydbUIRqH9piypWOPnoR8uFuUYwwbiKKQj4LeLmIe43Jg5eJgilsQ/tuwFbprjBGEy37+IT27TdjypmriY5aHo/OB+yS7grjulj6JzhqoKkc3gNui+X/pTs3dUcYRxMNz/4FLyc3lcfNyHdBvnxMVzd0RxiNsfQNeO+2qTw2IN8N6XKEqithjCXaFbUWuKNndhmTOzOJ1lGNoovzN7oSxrRY+jbg057bZUyu/BX1j0OmFboQti6Mkah/AVr64SXlptKZiXwZ5NsjC124NWFcGkvfHftAYyqV9bRfrXFpoQvrWpckLjwcigKl9Qc+B74ErC6hgcbkxR7Af6NNTK3Abk3Njes6XlSoxvgO0c68R7EoTPWwGvk0KLLIBUkXJQmjHu3GC5lRWruMyZ24T58zbdy1nXSQJIxxwJ5B+nVgWentMiZXliHfBvn6kR0vSBJG/JTMu0tvkzFlQdy3O53S1LHzPRht8mhA56DtTjQpYkw1MQR4h8jXd25qbvz/kdeONcZEor3cT2FRmOrlQ3S+Bsjn2x1f1lEYZ8TSD6RolDHlwP2x9JnxN+JNqWHAu2h892NgZ7wExFQ3A4H3ge3QkQK7NjU3roH2NcaJRJHb5mNRmOrnU+TroEMvw8147YQxIZaeizG1QdzXTwwTYVNqAOpoD0Q99GGoOWVMtTMIRTBsQBHThzQ1N24Ma4zDkCgAFmNRmBqhqbnxI+C5IDsAOByiplR85m9BhnYZUw48FUsfCcnCeCYzc4wpD+I+Pw7UxxiOhqzq0HDtbgk3GlOVNDUrpMG0cde+A+yKjhPYuR7F2QknM57PxTpj8ifsZ9QBh9ajYGohS7O3x5iyIL6KfFQ9cHDsBQvD1Cpx3z+4LzAHnV3Whg75M6YWWQVciZpSrYX2fBtTE4Sd746U4pxvY6oOC8OYBCwMYxKwMIxJwMIwJgELw5gELAxjErAwjEnAwjAmAQvDmAQsDGMSsDCMScDCMCYBC8OYBCwMYxKwMIxJwMIwJgELw5gELAxjErAwjEnAwjAmAQvDmAQsDGMSsDCMScDCMCYBC8OYBCwMYxKwMIxJwMIwJgELw5gELAxjErAwjEnAwjAmAQvDmAQsDGMSsDCMScDCMCYBC8OYBCwMYxLoC1wKNABtwC3A5lwtMiYHpo27tg/wPaAOaO0LnAqMCt5fAPw2J9uMyZMRwI+D9PJ6YEXszW9kb48xZUHc91fUA8sKvGlMLTE6ll5eDyxF/QuAMdnbY0xZMDb4tw1YUg+sAVYGL+6K2lrG1AzTxl07Avk+wMqm5sY14XBtc+y6o7I1y5jcift8M0TzGM/E3jgmM3OMKQ+OjaWfBahrXVIHMABYBwwEWoBhwMdZW2dMDgxC3YkGYCMwpKm5cWNYY2wEng7SDcBx2dtnTC4ci3weYEFTc+NGaL8k5IlY+qSsrDImZ+K+/qsw0VEYnwfpE1GzyphqZgDyddBSqMfDN+LCWAssCtLbAeMzMc2Y/DgB+TrAwqbmxjXhGx1X194fS5+WtlXG5MyZsfQD8Tc6CmMuGpUCOB4YkqJRxuTJEOTjIJ9/LP5mR2GsR+IA9dS/lappxuTHZKLRqLlNzY3r428mbVS6N5Y+Ny2rjMmZuG/f2/HNJGE8C7wZpPel/apDY6qB0cBXg/SbBLPdcZKEsQW4J5a/pORmGZMvcZ++p6m5cUvHCwrt+f53ok74N4E9SmyYMXmxB/JpgFbk650oJIx1wOwg3Rf4bklNMyY/LkY+DfBgU3PjuqSLthYl5LZY+lxg+xIZZkxeDAbOi+VvK3Th1oTxCtHCwu2BC3tvlzG5chHRD/wzyMcT6SquVFMsfRleP2Uql4HIh0Ou39rFXQnjOWB5kB4GTO25XcbkylTkwyCfXrSVa7sViXB6LH0VaqcZU0kMRr4b8qOubuiOMBagmgNgR+Dy4u0yJle+j3wX5MtPdXVDd2PX/iCWvhzYpTi7jMmNXVAY2pAfFLowTneFsZRoh9+2dNFxMaaMuB75LMiHl3bnpmKinf8T8FmQngwcUMS9xuTBAchXQb57RXdvLEYYvwNmxu77aZH3G5MlHX10JvBGMTcXw3S0BRbgYNrPIhpTTpyHfBS0xGn6Vq7tRLHC+AtqUoVcD+xU5GcYkzbDad8PvgL5brfpSVPoP4iGb3cA/rUHn2FMmsxAvgnwPPDzYj+gJ8JoQ+umwmXppwGn9OBzjEmDU4gCebQgX20rfHkyPe08/xft22wzUfVlTJ4MB+6I5acDr/fkg3ozqnQj8FKQHgbchc4vMyYP6pAPhj/QLyMf7RG9EcbnwLeBTUF+Al6abvLjQuSDoCbUPxBF1iya3s5DvEb7SZNbgP16+ZnGFMsI4OZY/irkmz2mFBN0twPzg3R/YA4KrW5MFgxCPjcgyD9JCUZKSyGMNmAK8E6Q/wqK0+P+hkmbOhTRZu8g/w5qQhU9CtWRUi3pWIuGyFqD/MnoMHFj0uRyoqmCVuSDawpf3n1KudZpGe1nxW/AEdNNeownOrAe5HvLClxbNKVeBDgD+EWQ7gPMwp1xU3r2Q77VJ8j/AvleyUhjdex5wItBejA6pWb3FL7H1CbD0AEv4RbrF0lhMWsawtiExpPfDvJfAH6N94qb3jMYhXTaM8i/jXxtU6Ebekpa+ynWoLMHNgT5/YBHgX4pfZ+pfvohH9o/yG9APlaSznZH0txotBLFCA1Hqo5AYT8tDlMs2yDfOSLItyLfWpnWF6a9A28hcBY6+A90Qma802RMV/RBnevwdNXN6IiwhWl+aRZbUx8GvkM06TIJuA+Lw3RNH+Qrk4J8G3A+8EjaX5zVnu170JkEoTgmA79EVaQxSWyDaoowmEEb8qFOpx+lQZbBDG5HM5WhOE4DHsJ9DtOZfsg3Tg/ybSho2u1ZGZB1lI/bUFUY73M8hRcdmohBaCFg2KdoQ+ez3JqlEXmEv7mb9uuqDkd7yB3d0OyMfCEcfdqMfkjvKHhHSuQVF+oR4ETgr0F+fxSB2stHapcRwAtE8xQtwBnohzRz8gyY9gxwJFFYkz3RIrAT8jLI5MYJ6IdxzyC/HjgO7bPIhbwjCa4ADgNWB/ntgHlopaT3c1Q/dahTPQ+VPcgXxtLF+RVpk7cwQLOXB6FqFDR2fSPeCVjthDvvbiKa01qBfOHVvIwKKQdhALyPOly/jL12Mlo5OSIXi0yajEBle3LstfvRQMz7uVjUgXIRBmiF5NnAPxJFVd8bhei5CDetqoE6VJYvEW1H/QyV+VmksEq2p5STMEJmoF+OcA95fzRcNxcHdatkhqMyvAOVKaiMD6PEm4xKQTkKAzQ6NRJtcgqZgPojp+ZikekNp6CymxB7bT4q4+WJd+RMuQoDFGBhPKpmwyp2OFoqMBtHWa8EhgMPok52WNtvQjPZE4iOlCg7ylkYoOUAM4ADaX9Y+SQUP/d8yv//UIvUo7J5gyjAMqgMD0Rrnnod4iZNKsWpVqFhvEaipSQ7AHcCS1CVbMqDkahM7iQKxd+Kyu4gVJZlT6UIAzR6MZ3owYeMQgF878HrrfJkF1QGL6MyCQl/uKYTjTaWPZUkjJDX0czoFHSEFOj/MQX4PXAtDryQJYPRM/89KoPQp9YF+bH0MBR/nlSiMEDt0/vQWPhMoqjW2wLXAH9Ey0oG5mJdbTAQPeM/omceHhn8OSqTfVAZlXVfohCVKoyQD4GpwNdQiJ6QoWhZyZ+BaXhpSSkZhJ7pn9EzHhp770lUFlOJavOKpNKFEfI6WqF5KO37H8OB69DCtBtQjCvTM76ADnxcjZ5pfLJ1CXr2x1OBzaYkqkUYIUuBMcAxRIsSQe3gK4E/oTmQ0dmbVrGMRs/sT+jciXj/bQVwLHrmS7M3LT2qTRghT6ORkcODdEhfNAeyFB0schmwY+bWlT9D0LN5DT2rSejZhTyNnu0hwILMrcuAahVGyGJUe3wdHWnbEntvX7SP+F3gMbTUZAC1ywAkgMfQGqZb0TMKaUHP8OvomS7O1rxsqWtdUlOLVoejGdnzgD0S3v8IreGZi4I0fJydabmwHWoKTUR9tKRBitXo0MefkVI4zDxpam5MfL3WhBFSj/Z/nI/W7DQkXNOCdpE9jbbhVsSMbTcYARwFHI2aQ4X+748jQTQDWzKzLmMKCaNv4qvVzxbg2eBve/SLeTowjmg3WQP6NT02yL+Lmg/Lgr9VRGGAypU+SAijg7/DgF0LXLsZiWA2Cp68PgP7ypZarTEKMQzVIOPRr+rWJgivRkPA5cxVaIi1EJ+i2vAJVEOU7WrXtHCN0T3WovU+96DO6OEoksk4FNqn0n9F2tC+iGZUWy4CNuZqUZliYRRmI5pND2fUd0JDwKPRMGVLgfvKiRa0EegF1PxbDnyQq0UVwv8BNYmwIpIWBvwAAAAASUVORK5CYII='
  let img2 =
    'data:image/png;base64,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'
  let trafficWay = [
    {
      name: '智慧文旅平台',
      value: 14294,
    },
    {
      name: '美团',
      value: 33314,
    },
    {
      name: '飞猪',
      value: 5137,
    },
    {
      name: '同城',
      value: 8245,
    },
  ]
  let sum = trafficWay.reduce((cur, pre) => {
    return cur + pre.value
  }, 0)
  let data = []
  let legendData = []
  let color = [
    'DeepSkyBlue',
    'Gold',
    'hotpink',
    'Aquamarine',
    'LightPink',
    'DodgerBlue',
    'Green',
    'CornflowerBlue',
  ]
  for (let i = 0; i < trafficWay.length; i++) {
    let name =
      trafficWay[i].name +
      '--' +
      ((trafficWay[i].value / sum) * 100).toFixed(1) +
      '%'
    legendData.push(name)
    data.push(
      {
        value: trafficWay[i].value,
        name: name,
        itemStyle: {
          borderWidth: 5,
          shadowBlur: 20,
          borderColor: color[i],
          shadowColor: color[i],
        },
      },
      {
        value: sum / 25,
        name: '',
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          color: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0,
        },
      },
    )
  }
  // 环状图表配置
  let seriesOption = [
    {
      name: '',
      type: 'pie',
      clockwise: false,
      radius: [84, 68],
      left: 220,
      // 高亮状态的扇区和标签样式
      emphasis: {
        scale: false, // 是否开启高亮后扇区的放大效果
      },
      // 饼图图形上的文本标签
      label: {
        show: false,
      },
      data: data,
    },
  ]
  let option = {
    color: color,
    // 原生图形元素组件
    graphic: {
      // 里面是所有图形元素的集合
      elements: [
        {
          type: 'image',
          z: 3,
          style: {
            image: img1,
            width: 110,
            height: 110,
          },
          left: 295,
          top: 'center',
          position: [100, 100],
        },
        {
          type: 'image',
          z: 3,
          style: {
            image: img2,
            width: 70,
            height: 70,
          },
          left: 315,
          top: 'center',
          position: [100, 100],
        },
        {
          type: 'image',
          z: 3,
          style: {
            image: img1,
            width: 190,
            height: 190,
          },
          left: 255,
          top: 'center',
          position: [150, 150],
        },
      ],
    },
    // 提示框组件
    tooltip: {
      show: false,
    },
    // 图例组件
    legend: {
      icon: 'circle',
      orient: 'vertical',
      data: legendData,
      left: 20,
      top: '20%',
      align: 'right',
      textStyle: {
        color: '#fff',
        fontSize: 17,
      },
      // 每个图例之间间隔
      itemGap: 26,
    },
    // 工具栏组件
    toolbox: {
      show: false,
    },
    // 系列配置
    series: seriesOption,
  }
  myEcharts.setOption(option)
})
</script>
<script lang="ts">
// 起名字，否则每个组件在开发者工具中都为index
export default {
  name: 'Counter',
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-rb.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 0px 0px 0px;
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
