<template>
  <div class="mine-resource">
    <div class="mine-resource-title">我的资源</div>

    <div class="flex-row" style="align-items: center">
      <div class="ideal-default-margin-right" style="width: 30%;padding-right: 10px;">
        <div class="flex-row mine-resource-content mine-resource-ecs">
          <div class="flex-row" style="align-items: center;">
            <img :src="ecsTotalImg" alt="" class="mine-resource-img" />
            <div class="mine-resource-text" style="margin-left: 5px;">云服务器总数：</div>
          </div>

          <div class="mine-resource-count">{{ chart.ecsCount }}</div>
        </div>
        <div class="flex-row mine-resource-content mine-resource-host">
          <div class="flex-row" style="align-items: center">
            <img :src="ebsTotalImg" alt="" class="mine-resource-img" />
            <div class="mine-resource-text" style="margin-left: 5px;">云硬盘总数：</div>
          </div>

          <div class="mine-resource-count">{{ chart.ebsCount }}</div>
        </div>
      </div>

      <el-divider direction="vertical" />

      <div id="cloudHost" class="mine-resource-pie"></div>

      <div id="cloudDisk" class="mine-resource-pie"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import ecsTotalImg from '@/assets/home/ecs-total.png'
import ebsTotalImg from '@/assets/home/ebs-total.png'
import { homeMineResource } from '@/api/java/home'


onMounted(() => {
  getMineResource()
  initEchart('cloudHost')
  initEchart('cloudDisk')
})

const chart = reactive({
  ecs: null as any, // 云服务器图表
  ecsCount: 0, // 云服务器总数
  ecsArray: [] as any[], // 云服务器数据
  ebs: null as any, // 云硬盘图表
  ebsCount: 0, // 云硬盘总数
  ebsArray: [] as any[] // 云硬盘数据
})
const getMineResource = () => {
  homeMineResource().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      data.forEach((item: any) => {
        if (item.name == 'ECS') {
          chart.ecsCount = item.value
          chart.ecsArray = item.itemList
        } else if (item.name === 'EBS') {
          chart.ebsCount = item.value
          chart.ebsArray = item.itemList
        }
      })
      initEchart('cloudHost')
      initEchart('cloudDisk')
    } else {
      chart.ecsCount = 0
      chart.ecsArray = []
      chart.ebsCount = 0
      chart.ebsArray = []
    }
  }).catch(_ => {
    chart.ecsCount = 0
    chart.ecsArray = []
    chart.ebsCount = 0
    chart.ebsArray = []
  })
}

const initEchart = (elementId: string) => {
  const echartDom = document.getElementById(elementId) as HTMLElement
  
  if (elementId === 'cloudHost') {
    option.title.text = `${chart.ecsCount}`
    option.title.subtext = '云服务器(台)'
    dataArray.value = chart.ecsArray
    option.series[0].data = chart.ecsArray
    if (!chart.ecs) {
      chart.ecs = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.ecs.setOption(option, true)
  } else if (elementId === 'cloudDisk') {
    option.title.text = `${chart.ebsCount}`
    option.title.subtext = '云硬盘(台)'
    dataArray.value = chart.ebsArray
    option.series[0].data = chart.ebsArray
    if (!chart.ebs) {
      chart.ebs = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.ebs.setOption(option, true)
  }
}
//echart图自适应
window.addEventListener('resize', function () {
  resizeEcharts('cloudHost')
  resizeEcharts('cloudDisk')
})
const resizeEcharts = (elementId: string) => {
  const echartDom = document.getElementById(elementId) as HTMLElement

  if (elementId === 'cloudHost') {
    if (!chart.ecs) {
      chart.ecs = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.ecs.resize()
  } else if (elementId === 'cloudDisk') {
    if (!chart.ebs) {
      chart.ebs = echarts.init(echartDom) // echarts实例不能用响应式变量
    }
    chart.ebs.resize()
  }
}

const dataArray = ref<any[]>([])
const option = reactive({
  title: {
    text: '总费用',
    subtext: '0',
    left: '28%',
    top: '35%',
    textStyle: {
      verticalAlign: 'middle',
      fontSize: 16
    },
    subtextStyle: {
      align: 'center',
      fontSize: 10
    },
    textAlign: 'center'
  },
  legend: {
    orient: 'vertical',
    left: '60%',
    top: '10',
    formatter: function (name: any) {
      let str = ''
      dataArray.value.forEach((item: any) => {
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
  color: ['#3774F6', '#55BCB8', '#8770EA', '#72B135'],
  series: [
    {
      name: '费用概览',
      type: 'pie',
      radius: ['65%', '80%'],
      center: ['30%', '50%'],
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
      data: dataArray.value
    }
  ]
})
</script>

<style scoped lang="scss">
$labelColor: #1d2129;
.mine-resource {
  background-color: white;
  padding: $idealPadding;
  :deep(.el-divider--vertical) {
    height: 100px;
  }
  .mine-resource-title {
    margin-right: 10px;
    color: $labelColor;
    font-weight: 500;
    font-size: $mediumFontSize;
  }
  .mine-resource-content {
    padding: 12px 20px;
    align-items: center;
    justify-content: space-between;
    border-radius: $circleRadiusSize;
    color: white;
    .mine-resource-img {
      width: 28px;
      height: 28px;
    }
    .mine-resource-text {
      font-size: $defaultFontSize;
    }
    .mine-resource-count {
      font-size: $largeFontSize;
    }
  }
  .mine-resource-ecs {
    background: linear-gradient(to right, #4a89f6, #749ef2);
  }
  .mine-resource-host {
    margin-top: 10px;
    background: linear-gradient(to right, #977aee, #969fef);
  }
  .mine-resource-pie {
    width: 32%;
    height: 150px;
  }
}
</style>
