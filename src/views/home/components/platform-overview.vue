<template>
  <div class="platform">
    <div class="platform-title">平台概览</div>

    <div id="platform" class="platform-pie"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { homePlatformOverview } from '@/api/java/home'

onMounted(() => {
  getPlatform()
  initEchart()
})

const getPlatform = () => {
  homePlatformOverview().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      option.title.text = data.cloudResourcePool
      dataArray.value = data.itemList
      option.series[0].data = data.itemList
      initEchart()
    }
  })
}

let myEchart: any
const initEchart = () => {
  const echartDom = document.getElementById('platform') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }
  myEchart.setOption(option, true)
}
//echart图自适应
window.addEventListener('resize', function () {
  resizeEcharts()
})
const resizeEcharts = () => {
  const echartDom = document.getElementById('platform') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom)
  }
  myEchart.resize()
}

const dataArray = ref<any[]>([])
const option = reactive({
  title: {
    text: '',
    subtext: '资源池',
    left: '28%',
    top: '40%',
    textStyle: {
      verticalAlign: 'middle',
      fontSize: 16
    },
    subtextStyle: {
      align: 'center'
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
      return `${name}：${str}个`
    }
  },
  tooltip: {
    trigger: 'item'
  },
  color: ['#55BCB8', '#8770EA', '#72B135', '#3774F6','#48A1FF', '#5ACC76', '#FBD34B', '#F4657C', '#985FE5', '#4FCCCA'],
  series: [
    {
      name: '费用概览',
      type: 'pie',
      radius: ['75%', '90%'],
      center: ['30%', '55%'],
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
.platform {
  background-color: white;
  margin-left: 10px;
  padding: $idealPadding;
  .platform-circle {
    width: 4px;
    height: 4px;
    border-radius: 50%;
  }
  .platform-title {
    font-size: $mediumFontSize;
    font-weight: 500;
  }
  .platform-pie {
    width: 100%;
    height: 180px;
  }
  .platform-container {
    align-items: center;
    width: 100%;
    .platform-container-img {
      width: 300px;
      height: 150px;
    }
    .platform-container-info {
      align-items: center;
      justify-content: space-around;
      width: 100%;
      background-color: #FAFAFA;
      padding: $idealPadding 0;
      margin-top: 20px;
    }
  }
  :deep(.el-divider--vertical) {
    height: 20px;
  }
}
</style>
