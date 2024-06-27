<template>
  <div class="result-overview">
    <div>云资源体检结果概览</div>

    <div class="flex-row result-overview-container">
      <div class="result-overview-title">
        <div>不合规资源占比</div>
        <div>不合规资源:4</div>
      </div>

      <div id="gauge" class="result-overview-gauge"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

onMounted(() => {
  initEchart()
})
// 图表
let myEchart: any
const initEchart = () => {
  const echartDom = document.getElementById('gauge') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }

  myEchart.setOption(option)
}
//echart图自适应
window.addEventListener('resize', function () {
  const echartDom = document.getElementById('gauge') as HTMLElement
  const myEchart = echarts.init(echartDom)
  myEchart.resize()
})
// 图表设置
const option = reactive({
  series: [
    {
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      center: ['50%', '50%'],
      radius: '90%',
      min: 0,
      max: 1,
      splitNumber: 10, // 仪表盘刻度的分割段数
      axisLine: {
        show: false, // 是否显示仪表盘轴线
        lineStyle: {
          color: [
            [0.041, '#0F82FF'],
            [1, '#384350']
          ]
        }
      },
      pointer: {
        show: false
      },
      axisTick: {
        length: 20,
        splitNumber: 2,
        lineStyle: {
          color: 'auto',
          width: 5 // 刻度宽
        }
      },
      splitLine: {
        show: false // 是否显示分隔线
      },
      axisLabel: {
        show: false // 是否显示标签
      },
      title: {
        show: false, // 是否显示标题
      },
      detail: {
        fontSize: 20,
        offsetCenter: [0, '5%'],
        valueAnimation: true,
        formatter: function (value: number) {
          return Math.round(value * 100) + '%';
        },
        color: 'inherit'
      },
      data: [
        {
          value: 0.041,
          name: 'Grade Rating'
        }
      ]
    }
  ]
})
</script>

<style scoped lang="scss">
.result-overview {
  width: 100%;
  padding: $idealPadding;
  .result-overview-container {
    width: 100%;
    height: 200px;
    align-items: center;
    .result-overview-title {
      width: 20%;
    }
    .result-overview-gauge {
      width: 80%;
      height: 200px;
    }
  }
}
</style>
