<template>
  <div class="host">
    <div class="flex-row host-header">
      <div class="host-title">云主机资源概览</div>
      <div class="flex-row host-alive">
        <svg-icon icon="success-icon" color="#52C41A" />
        <div class="host-alive-label">运行中</div>
        <div class="host-alive-label">{{ runningInstanceCount }}台</div>
      </div>
    </div>

    <div id="bareEchart" class="host-line"></div>

    <div class="host-statistics">
      <div
        v-for="(item, index) of statisticsArray"
        :key="index"
        class="flex-row flex-row-center"
      >
        <svg-icon :icon="item.icon" />
        <div class="host-statistics-label">{{ item.label }}</div>
        <el-divider border-style="dashed" />
        <div class="host-statistics-count">{{ item.count }}</div>
        <div class="host-statistics-unit">{{ item.unit }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 裸金属资源概览组件
 */
import * as echarts from 'echarts'
import { homeVmStatistics } from '@/api/java/home'
import { dayjs } from 'element-plus'

onMounted(() => {
  initEchart()
  getStatistics()
})
const runningInstanceCount = ref(0)
const getStatistics = () => {
  homeVmStatistics().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      handleUtil(data.cpuUtil,data.diskUtil,data.menUtil)
      runningInstanceCount.value = data.runningInstanceCount
      statisticsArray.value.forEach((item: any) => {
        if (item.key === 'cpuCount') {
          item.count = data.cpuCount
        } else if (item.key === 'memCount') {
          item.count = data.memCount
        } else if (item.key === 'instanceCount') {
          item.count = data.instanceCount
        }
      })
    } else {
      handleUtil([],[],[])
      statisticsArray.value.forEach((item: any) => {
        item.count = 0
      })
    }
  }).catch(_ => {
    handleUtil([],[],[])
    statisticsArray.value.forEach((item: any) => {
      item.count = 0
    })
  })
}
const handleUtil = (cpuUtil: any[], diskUtil: any[], menUtil: any[]) => {
  const arr: any[] = []

  const dateArray = [cpuUtil,diskUtil,menUtil]
  let haveDate = false
  dateArray.forEach((array: any[]) => {
    if (array.length && !haveDate) {
      array.forEach((item: any) => {
        const date = dayjs.unix(item.sampling_time).format('YYYY-MM-DD HH:mm:ss')
        arr.push(date)
      })
      haveDate = true
    }
  })

  const cpuArr: any[] = []
  const diskArr: any[] = []
  const menArr: any[] = []

  if (cpuUtil.length) {
    cpuUtil.forEach((item: any) => {
      cpuArr.push(item.sampling_value)
    })
  }
  if (diskUtil.length) {
    diskUtil.forEach((item: any) => {
      diskArr.push(item.sampling_value)
    })
  }
  if (menUtil.length) {
    menUtil.forEach((item: any) => {
      menArr.push(item.sampling_value)
    })
  }
  option.value.xAxis.data = arr
  option.value.series[0].data = cpuArr
  option.value.series[1].data = menArr
  option.value.series[2].data = diskArr
  initEchart()
}
// 统计
const statisticsArray: any = ref([
  { icon: 'host-total', label: '总台数', key: 'instanceCount', count: '0', unit: '台' },
  { icon: 'cpu-total', label: 'CPU总量', key: 'cpuCount', count: '0', unit: '核' },
  { icon: 'memory-total', label: '内存总量', key: 'memCount', count: '0', unit: 'GB' },
  // { icon: 'store-total', label: '存储总量', key: '', count: '0', unit: 'TB' }
])
// 折线图
const option = ref({
  tooltip: {
    trigger: 'axis',
    showContent: true,
    formatter: function(params: any[]) {
      let result = params[0].name
      params.forEach((item: any) => {
        result += '<br/>'
        result += '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + item.color + '"></span>'
        result += item.seriesName + '<b style="margin-left: 10px">' + item.value + '%' + '</b>'
      })
      return result
    }
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
    min: 0,
    max: 100,
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
  },
  series: [
    {
      name: 'CPU使用率',
      type: 'line',
      data: [0, 10, 30, 50, 25, 60, 35],
      symbol: 'none'
    },
    {
      name: '内存使用率',
      type: 'line',
      data: ['20', '10', '70', '50', '40', '10', '80'],
      symbol: 'none'
    },
    {
      name: '存储使用率',
      type: 'line',
      data: ['90', '5', '15', '35', '95', '45', '10'],
      symbol: 'none'
    }
  ]
})

let myEchart: echarts.ECharts | null = null
const initEchart = () => {
  const bareEchart = document.getElementById('bareEchart') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(bareEchart) // echarts实例不能用响应式变量
  }
  myEchart.setOption(option.value)
}
//echart图自适应
window.addEventListener('resize', function () {
  const bareEchart = document.getElementById('bareEchart') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(bareEchart)
  }
  myEchart.resize()
})
</script>

<style scoped lang="scss">
.flex-row-center {
  align-items: center;
}
.host {
  background-color: white;
  padding: $idealPadding;
  height: calc(100% - 40px);
  .host-header {
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    .host-title {
      color: #2b2f39;
      font-weight: 500;
      font-size: 16px;
    }
    .host-alive {
      border-radius: $circleRadiusSize;
      padding: 0 10px;
      align-items: center;
      background-color: rgba($color: #52c41a, $alpha: 0.1);
      .host-alive-label {
        color: #52c41a;
        font-weight: 400;
        font-size: 12px;
        margin: 3px 5px;
      }
    }
  }
  .host-line {
    width: 100%;
    height: 150px;
  }
  .host-statistics {
    border-radius: $circleRadiusSize;
    background-color: #f7f8fa;
    margin-top: 10px;
    padding: 10px;
    .host-statistics-label,
    .host-statistics-unit {
      color: #86909c;
      font-weight: 400;
      font-size: 12px;
      padding: 0 5px;
    }
    .host-statistics-label {
      width: 80px;
    }
    .host-statistics-count {
      font-weight: 500;
      font-size: 16px;
      padding-left: 5px;
    }
    :deep(.el-divider--horizontal) {
      margin: 10px 0;
    }
  }
}
</style>
