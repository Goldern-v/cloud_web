<template>
  <div id="pieEcharts" style="width: 100%; height: 300px"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
// 属性值
interface PortProps {
  pieData?: any
}
const props = withDefaults(defineProps<PortProps>(), {
  pieData: null
})

const seriesData = ref()

watch(
  () => props.pieData,
  val => {
    seriesData.value = val.map((item: any) => {
      if (item.key === 'LINE') {
        item.name = '线路'
      } else if (item.key === 'PORT') {
        item.name = '端口'
      } else {
        item.name = item.key
      }
      return item
    })
  },
  { immediate: true }
)

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
    tooltip: {
      show: true,
      trigger: 'item'
    },
    series: [
      {
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
        data: seriesData.value,
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
