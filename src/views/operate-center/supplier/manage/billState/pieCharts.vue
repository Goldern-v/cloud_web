<template>
  <div id="pieEcharts" style="width: 100%; height: 300px"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'

let myChart: any
const initEchart = () => {
  const echartDom = document.getElementById('pieEcharts')
  if (myChart != null && myChart != '' && myChart != undefined) {
    myChart.dispose()
  }
  myChart = echarts.init(echartDom)
  let option = {
    legend: {
      orient: 'vertical',
      left: 'right',
      y: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        center: ['30%', '50%'], // 调整图位置，[0]左右，[1]上下
        label: {
          normal: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  myChart.setOption(option)
}
//echart图自适应
window.addEventListener('resize', function () {
  myChart.resize()
})
defineExpose({
  initEchart
})
</script>
