<template>
  <div class="usage-trends">
    <div class="flex-row usage-trends-header">
      <div class="usage-trends-header-title">云服务器使用量趋势</div>

      <el-radio-group v-model="range" @change="clickChangeRange">
        <el-radio-button
          v-for="(item, index) of timeList"
          :key="index"
          :label="item.label"
          >{{ item.title }}</el-radio-button
        >
      </el-radio-group>
    </div>

    <div id="usage" class="usage-trends-line"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { homeInstanceStatistics } from '@/api/java/home'

// 时间范围
const range = ref('LAST_SEVEN_DAY')
const timeList = [
  { label: 'LAST_SEVEN_DAY', title: '近7天' },
  { label: 'LAST_THIRTY_DAY', title: '近30天' },
  { label: 'LAST_SIX_MONTH', title: '近半年' },
  { label: 'LAST_ONE_YEAR', title: '近1年' }
]

onMounted(() => {
  getInstanceStatistics(range.value)
  initEchart()
})

const getInstanceStatistics = (type: string) => {
  homeInstanceStatistics({ type }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      option.xAxis.data = data.xAxis
      option.series = data.yAxis.map((item: any) => {
        item.type = 'line'
        item.data = item.value
        return item
      })
      initEchart()
    }
  })
}

const clickChangeRange = (type: string) => {
  getInstanceStatistics(type)
}

// 图表
let myEchart: any
const initEchart = () => {
  const echartDom = document.getElementById('usage') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }

  myEchart.setOption(option, true)
}
//echart图自适应
window.addEventListener('resize', function () {
  const echartDom = document.getElementById('usage') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }
  myEchart.resize()
})

const option = reactive({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    left: 'center',
    bottom: '0'
  },
  grid: {
    left: '2%',
    right: '4%',
    bottom: '12%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    splitLine: {
      // 网格线
      lineStyle: {
        type: 'dashed' //设置网格线类型 dotted：虚线   solid:实线
      },
      show: true //隐藏或显示
    }
  },
  color: ['#30C25B', '#2B99FF', '#55BCB8', '#8770EA', '#72B135', '#3774F6'],
  series: []
})
</script>

<style scoped lang="scss">
.usage-trends {
  background-color: white;
  padding: $idealPadding;
  .usage-trends-header {
    justify-content: space-between;
    align-items: center;
    .usage-trends-header-title {
      font-size: $mediumFontSize;
      font-weight: 500;
    }
  }
  .usage-trends-line {
    width: 100%;
    height: 200px;
  }
}
</style>
