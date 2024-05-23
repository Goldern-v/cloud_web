<template>
  <div class="alarm">
    <div>告警统计</div>

    <div id="alarmPie" class="alarm-pie"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'


let myEchart: any
onMounted(() => {
  initEchart()
})

const initEchart = () => {
  const echartDom = document.getElementById('alarmPie') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }
  option.title.text = '云服务器'
  dataArray.value = [{ value: 6, name: '华为云' },
      { value: 2, name: '阿里云' },
      { value: 1, name: 'VMware' },
      { value: 3, name: 'ZStack' }]
  option.series[0].data = dataArray.value
  myEchart.setOption(option)
}
//echart图自适应
window.addEventListener('resize', function () {
  resizeEcharts()
})
const resizeEcharts = () => {
  const echartDom = document.getElementById('alarmPie') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom)
  }
  myEchart.resize()
}

const dataArray = ref<any[]>([])
const option = reactive({
  title: {
    text: '',
    subtext: '¥0',
    left: '20%',
    top: '40%',
    textStyle: {
      verticalAlign: 'middle',
      fontSize: 12
    }
  },
  legend: {
    orient: 'vertical',
    left: '60%',
    top: '20%',
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
  color: ['#48A1FF', '#5ACC76','#FBD34B','#F4657C'],
  series: [
    {
      name: '费用概览',
      type: 'pie',
      radius: ['45%', '60%'],
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
.alarm {
  padding: $idealPadding;
  .alarm-pie {
    width: 100%;
    height: 200px;
  }
}
</style>
