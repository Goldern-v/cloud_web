<template>
  <div class="cost">
    <div class="flex-row flex-row-between">
      <div class="cost-title ideal-default-margin-right">费用概览</div>

      <div class="ideal-tip-text">更多></div>
    </div>

    <div class="flex-row ideal-default-margin-top">
      <div style="width: 30%;">
        <div>本月花费</div>
        <div class="cost-title">¥{{ monthPay }}</div>
      </div>

      <div style="width: 30%;">
        <div>本年花费</div>
        <div class="cost-title">¥{{ yearPay }}</div>
      </div>
    </div>

    <el-divider />

    <div>本月费用分布</div>
    <div id="circle" class="circle-box"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { homeCostOverview, homeCostDistribution } from '@/api/java/home'

onMounted(() => {
  initEchart()
  getCost()
  getDistribution()
})
const monthPay = ref(0)
const yearPay = ref(0)
const monthCost = ref<any[]>([])

// 费用概览
const getCost = () => {
  homeCostOverview().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      monthPay.value = data.costOverviewMonth
      yearPay.value = data.costOverviewYear
    }
  })
}
const getDistribution = () => {
  homeCostDistribution().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      monthCost.value = data.costOverviewMonthList
    } else {
      monthCost.value = []
    }
    getMonth()
  }).catch(_ => {
    monthCost.value = []
  })
}
const getMonth = () => {
  let sum = 0
  monthCost.value.forEach((item: any) => {
    item.value = item.payAmount
    item.name = item.cloudPlatformName
    sum += item.payAmount
  })
  option.value.title.subtext = String(sum)
  option.value.series[0].data = monthCost.value

  initEchart()
}
let myEchart: any
const initEchart = () => {
  const echartDom = document.getElementById('circle') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }
  myEchart.setOption(option.value)
}
//echart图自适应
window.addEventListener('resize', function () {
  const echartDom = document.getElementById('circle') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom)
  }
  myEchart.resize()
})

const option = ref({
  title: {
    text: '总费用',
    subtext: '¥0',
    left: '12%',
    top: '30%',
    textStyle: {
      verticalAlign: 'middle',
      fontSize: 12
    }
  },
  legend: {
    orient: 'vertical',
    left: '40%',
    top: '10',
    formatter: function (name: any) {
      let str = ''
      monthCost.value.forEach((item: any) => {
        if (name === item.name) {
          str = item.value
        }
      })
      return `${name}：${str}`
    }
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '费用概览',
      type: 'pie',
      radius: ['70%', '90%'],
      center: ['20%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      data: monthCost.value
    }
  ]
})
</script>

<style scoped lang="scss">
.cost {
  background-color: white;
  align-items: center;
  margin-left: 10px;
  padding: $idealPadding;
  .flex-row-between {
    align-items: center;
    justify-content: space-between;
  }
  .cost-title {
    color: #2b2f39;
    font-weight: 500;
    font-size: 16px;
  }
  .circle-box {
    width: 100%;
    height: 150px;
  }
}
</style>
