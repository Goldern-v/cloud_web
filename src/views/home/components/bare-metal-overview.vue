<template>
  <div class="bare-metal">
    <div class="flex-row bare-metal-header">
      <div class="bare-metal-title">裸金属资源概览</div>
      <div class="flex-row bare-metal-alive">
        <svg-icon icon="success-icon" color="#52C41A" />
        <div class="bare-metal-alive-label">运行中</div>
        <div class="bare-metal-alive-label">12台</div>
      </div>
    </div>

    <div ref="bareEchart" class="bare-metal-line"></div>

    <div class="bare-metal-statistics">
      <div
        v-for="(item, index) of statisticsArray"
        :key="index"
        class="flex-row flex-row-center"
      >
        <svg-icon :icon="item.icon" />
        <div class="bare-metal-statistics-label">{{ item.label }}</div>
        <el-divider border-style="dashed" />
        <div class="bare-metal-statistics-num">{{ item.num }}</div>
        <div class="bare-metal-statistics-unit">{{ item.unit }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 裸金属资源概览组件
 */
import * as echarts from 'echarts'

// 折线图
type EChartsOption = echarts.EChartsOption
const bareEchart = ref<HTMLElement>()
const option: EChartsOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['CPU使用率', '内存使用率', '存储使用率'],
    icon: 'roundRect',
    right: '0'
  },
  color: ['#F77234', '#0FC6C2', '#165DFF'],
  grid: {
    left: '3%',
    right: '3%',
    bottom: '6%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'CPU使用率',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
      symbol: 'none'
    },
    {
      name: '内存使用率',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
      symbol: 'none'
    },
    {
      name: '存储使用率',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
      symbol: 'none'
    }
  ]
}

const initEchart = () => {
  let myEchart = echarts.init(bareEchart.value!) // echarts实例不能用响应式变量
  myEchart.setOption(option)
}
//echart图自适应
window.addEventListener('resize', function () {
  let myEchart = echarts.init(bareEchart.value!)
  myEchart.resize()
})
onMounted(() => {
  initEchart()
})
// 统计
const statisticsArray: any = ref([
  { icon: 'host-total', label: '总台数', num: '654', unit: '台' },
  { icon: 'cpu-total', label: 'CPU总量', num: '76575', unit: '核' },
  { icon: 'memory-total', label: '内存总量', num: '3243', unit: 'GB' },
  { icon: 'store-total', label: '存储总量', num: '565', unit: 'TB' }
])
</script>

<style scoped lang="scss">
.flex-row-center {
  align-items: center;
}
.bare-metal {
  background-color: white;
  margin-left: 10px;
  padding: $idealPadding;
  .bare-metal-header {
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    .bare-metal-title {
      color: #2b2f39;
      font-weight: 500;
      font-size: 16px;
    }
    .bare-metal-alive {
      border-radius: $circleRadiusSize;
      padding: 0 10px;
      align-items: center;
      background-color: rgba($color: #52c41a, $alpha: 0.1);
      .bare-metal-alive-label {
        color: #52c41a;
        font-weight: 400;
        font-size: 12px;
        margin: 3px 5px;
      }
    }
  }
  .bare-metal-line {
    width: 100%;
    height: 300px;
  }
  .bare-metal-statistics {
    border-radius: $circleRadiusSize;
    background-color: #f7f8fa;
    margin-top: 20px;
    padding: $idealPadding;
    .bare-metal-statistics-label,
    .bare-metal-statistics-unit {
      color: #86909c;
      font-weight: 400;
      font-size: 12px;
      padding: 0 5px;
    }
    .bare-metal-statistics-label {
      width: 80px;
    }
    .bare-metal-statistics-num {
      font-weight: 500;
      font-size: 16px;
      padding-left: 5px;
    }
    :deep(.el-divider--horizontal) {
      margin: 24px 0;
    }
  }
}
</style>
