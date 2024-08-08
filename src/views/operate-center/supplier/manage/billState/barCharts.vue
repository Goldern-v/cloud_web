<template>
  <div id="barEcharts" style="width: 100%; height: 300px"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'

let myChart: any
const initEchart = () => {
  const echartDom = document.getElementById('barEcharts')
  if (myChart != null && myChart != '' && myChart != undefined) {
    myChart.dispose()
  }
  myChart = echarts.init(echartDom)
  let option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
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
