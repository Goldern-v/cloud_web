<template>
  <div class="cost-overview">
    <div id="costBubble" class="ost-overview-bubble"></div>

    <div id="costLine" class="ost-overview-line" style="margin: 0 0 20px;"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

// 图表
const chart = reactive({
  bubble: null as any,
  line: null as any
})

onMounted(() => {
  initEchart('costBubble', option)
  initEchart('costLine', lineOption)
})

const initEchart = (elementId: string, option: any) => {
  const echartDom = document.getElementById(elementId) as HTMLElement
  if (elementId === 'costBubble') {
    setData()
    if (!chart.bubble) {
      chart.bubble = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.bubble.setOption(option)
  } else if (elementId === 'costLine') {
    if (!chart.line) {
      chart.line = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.line.setOption(option)
  }
  
  
}
//echart图自适应
window.addEventListener('resize', function () {
  resizeEchart('costBubble')
  resizeEchart('costLine')
})
const resizeEchart = (elementId: string) => {
  const echartDom = document.getElementById(elementId) as HTMLElement
  if (elementId === 'costBubble') {
    if (!chart.bubble) {
      chart.bubble = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.bubble.setOption(option)
  } else if (elementId === 'costLine') {
    if (!chart.line) {
      chart.line = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.line.setOption(option)
  }
}

const poparray = ref<any[]>([
  //气泡图的数据，label是字，amount是大小
  { label: '阿里云', amount: 100 },
  { label: '华三', amount: 70 },
  { label: '天翼云', amount: 30 },
  { label: '腾讯云', amount: 50 },
  { label: '京东云', amount: 70 },
  { label: '华为云', amount: 70 },
  { label: 'Vmware', amount: 70 }
])

const bubbleData = ref<any[]>([])
// 节点之间的斥力因子,值越大,气泡间距越大
const repulsion = ref(100)
const setData = () => {
  const format = ["label", "amount"]
  let maxValue = 0
  const temp: any[] = []
  poparray.value.forEach((item:any) => {
    temp.push(item[format[1]])
  })
  maxValue = Math.max.apply(null, temp)
  // 气泡颜色数组
  let color = ['#246FEC', '#9EC2F7', '#2D71EA']
  // 气泡颜色备份
  let bakeColor = [...color]
  // 气泡数据
  
  // 气泡基础大小
  let basicSize = 30
  
  // 根据气泡数量配置基础大小和斥力因子（以实际情况进行适当调整，使气泡合理分布）
  if (poparray.value.length >= 5 && poparray.value.length < 10) {
    basicSize = 40
    repulsion.value = 200
  }
  if (poparray.value.length >= 10 && poparray.value.length < 20) {
    basicSize = 30
    repulsion.value = 150
  } else if (poparray.value.length >= 20) {
    basicSize = 20
    repulsion.value = 100
  }

  // 填充气泡数据数组bubbleData
  for (let item of poparray.value) {
    // 确保气泡数据条数少于或等于气泡颜色数组大小时，气泡颜色不重复
    if (!bakeColor.length) {
      bakeColor = [...color]
    }
    let colorSet = new Set(bakeColor)
    let curIndex = Math.round(Math.random() * (colorSet.size - 1))
    let curColor = bakeColor[curIndex]
    colorSet.delete(curColor)
    bakeColor = [...colorSet]
    // 气泡大小设置
    let size = (item[format[1]] * basicSize * 2) / maxValue
    if (size < basicSize) {
      size = basicSize
    }

    bubbleData.value.push({
      name: item[format[0]],
      value: item[format[1]],
      symbolSize: size,
      draggable: true,
      itemStyle: {
        normal: { color: curColor }
      }
    })
  }
}
const option = reactive({
  backgroundColor: '#fff',
  animationEasingUpdate: 'bounceIn',
  grid: {
    top: '2%',
    bottom: '2%',
    left: '2%',
    right: '2%'
  },
  series: [
    {
      type: 'graph',
      layout: 'force',
      force: {
        repulsion: repulsion.value,
        edgeLength: 20,
        layoutAnimation: true
      },
      // 是否开启鼠标缩放和平移漫游
      roam: false,
      label: { normal: { show: true } },
      data: bubbleData.value
    }
  ]
})
const lineOption = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '1%',
    right: '1%',
    bottom: '20px',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [120, 232, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
})
</script>

<style scoped lang="scss">
.cost-overview {
  width: 100%;
  padding: $idealPadding;
  .ost-overview-bubble {
    width: 100%;
    height: 150px;
  }
  .ost-overview-line {
    width: 100%;
    height: 200px;
  }
}
</style>
