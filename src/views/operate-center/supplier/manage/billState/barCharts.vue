<template>
  <div id="barEcharts" style="width: 100%; height: 300px"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
// 属性值
interface PortProps {
  barData?: any // 行数据
}
const props = withDefaults(defineProps<PortProps>(), {
  barData: null
})

const xData = ref()
const seriesData = ref()

watch(
  () => props.barData,
  val => {
    if (Object.keys(val).length > 0) {
      xData.value = val.dates
      seriesData.value = val.incomes
    }
  },
  { immediate: true }
)

let myChart: any
const initEchart = () => {
  const echartDom = document.getElementById('barEcharts')
  if (myChart != null && myChart !== '' && myChart != undefined) {
    myChart.dispose()
  }
  myChart = echarts.init(echartDom)
  let option = {
    xAxis: {
      type: 'category',
      data: xData.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: seriesData.value,
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
