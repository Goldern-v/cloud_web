<template>
  <div class="line">
    <div class="flex-row line-header">
      <div class="line-title">{{ item.cnName }}</div>
      <div class="flex-row">
        <div class="flex-column line-max">
          <div class="line-number-title">最大值</div>
          <div>{{ item.max }}</div>
        </div>

        <div class="flex-column line-min">
          <div class="line-number-title">最小值</div>
          <div>{{ item.min }}</div>
        </div>
      </div>
    </div>
    <div :id="item.enName" class="line-chart"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

interface LineChartProps {
  item: any
  statisticsValue: string[]
  statisticsData: string[]
}
const props = withDefaults(defineProps<LineChartProps>(), {
  item: () => ({}),
  statisticsValue: () => [],
  statisticsData: () => []
})

onMounted(() => {
  initEchart()
})

const date: any = ref([])
watch(
  () => props.statisticsValue,
  value => {
    nextTick(() => {
      // 初始化主题样式
      initEchart()
    })
  },
  { deep: true }
)

type EChartsOption = echarts.EChartsOption

let myEchart: any
const initEchart = () => {
  let date: string[] = []
  let data = props.statisticsValue
  data.forEach((item: any) => {
    date.push(item.date)
  })
  const echartDom = document.getElementById(props.item.enName) as HTMLElement
  if (myEchart != null && myEchart != undefined) {
    myEchart.dispose()
  }
  myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  const option: EChartsOption = {
    grid: {
      top: '8%',
      left: '5%',
      right: '8%',
      containLabel: true
    },
    color: ['#366ef4'],
    title: {
      show: props.statisticsValue.length === 0,
      textStyle: {
        color: 'grey',
        fontSize: 16,
        fontFamily: 'pingfangRegular'
      },
      text: '暂无数据',
      left: 'center',
      top: 'center'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#E5E6EB',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        //x轴文字的配置
        show: true,
        color: '#4E5969'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: props.statisticsValue,
        type: 'line',
        symbol: 'none'
      }
    ]
  }
  myEchart.setOption(option)
}

//echart图自适应
window.addEventListener('resize', function () {
  const echartDom = document.getElementById(props.item.enName) as HTMLElement
  let myEchart = echarts.init(echartDom)
  myEchart.resize()
})

</script>

<style scoped lang="scss">
.line {
  border: 1px solid #c5c5c5;
  border-radius: $circleRadiusSize;
  .line-header {
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 10px 0;
    .line-max,
    .line-min,
    .line-average {
      padding: 0 10px;
      .line-number-title {
        font-weight: 400;
        font-size: 12px;
        color: #5e5e5e;
      }
    }
    .line-title {
      color: #000;
      font-weight: 600;
      font-size: 14px;
    }
  }
  .line-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
