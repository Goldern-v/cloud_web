<template>
  <div class="trends">
    <div class="flex-row trends-header">
      <div class="trends-header-title">消费趋势（单位：元）</div>

      <el-radio-group v-model="range" @change="clickChangeRange">
        <el-radio-button
          v-for="(item, index) of timeList"
          :key="index"
          :label="item.label"
          >{{ item.title }}</el-radio-button
        >
      </el-radio-group>
    </div>

    <div class="flex-row trends-container">
      <div id="trendsBar" class="trends-bar"></div>
      <div class="trends-ranking">
        <div class="trends-ranking-title">平台消费排名</div>

        <el-scrollbar>
          <div
            v-for="(item, index) of orderList"
            :key="index"
            class="flex-row trends-ranking-item"
          >
            <div
              class="flex-row trends-ranking-bg"
              :style="{ backgroundColor: index > 2 ? '#F0F2F5' : '#314659' }"
            >
              <div :style="{ color: index > 2 ? '#575758' : '#ffffff' }">
                {{ index }}
              </div>
            </div>
            <div>{{ item.cloudPlatformName }}</div>
            <div>{{ item.payAmount }}</div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { homeCostTrend } from '@/api/java/home'

// 时间范围
const range = ref('DAY')
const timeList = [
  { label: 'DAY', title: '本日' },
  { label: 'WEEK', title: '本周' },
  { label: 'MONTH', title: '本月' },
  { label: 'LAST_SIX_MONTH', title: '近6月' },
  { label: 'LAST_ONE_YEAR', title: '近1年' }
]

onMounted(() => {
  initEchart()
  getTrend(range.value)
})
const timeScope = ref('')
const sum = ref(0)
// 平台排名
const orderList = ref<any[]>()
const getTrend = (type: string) => {
  const params = { type }
  homeCostTrend(params)
    .then((res: any) => {
      const { code, data } = res
      sum.value = 0
      if (code === 200) {
        orderList.value = data.orderList
        option.xAxis.data = data.xAxis
        option.series[0].data = data.yAxis
        if (data.yAxis.length) {
          timeScope.value =
            data.yAxis[0] + '-' + data.yAxis[data.yAxis.length - 1]
        }
        if (data.xAxis.length) {
          data.xAxis.forEach((item: number) => {
            sum.value += item
          })
        }
        initEchart()
      } else {
        option.xAxis.data = []
        option.series[0].data = []
        initEchart()
      }
    })
    .catch(_ => {
      sum.value = 0
      option.xAxis.data = []
      option.series[0].data = []
      initEchart()
    })
}

const clickChangeRange = (value: string) => {
  getTrend(value)
}

// 图表
let myEchart: any
const initEchart = () => {
  const echartDom = document.getElementById('trendsBar') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }

  myEchart.setOption(option, true)
}
//echart图自适应
window.addEventListener('resize', function () {
  const echartDom = document.getElementById('trendsBar') as HTMLElement
  if (!myEchart) {
    myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  }
  myEchart.resize()
})
const option = reactive({
  grid: {
    left: '2%',
    right: '2%',
    bottom: '2%',
    containLabel: true
  },
  color: ['#48A1FF'],
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true
    }
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
  series: [
    {
      data: [],
      type: 'bar',
      barWidth: '20'
    }
  ]
})
</script>

<style scoped lang="scss">
.trends {
  background-color: white;
  padding: $idealPadding;
  .trends-header {
    justify-content: space-between;
    align-items: center;
    .trends-header-title {
      font-size: $mediumFontSize;
      font-weight: 500;
    }
  }
  .trends-optimization {
    justify-content: space-around;
    align-items: center;
    margin: 0 10px;
    .trends-optimization-item {
      width: 15%;
      padding: 10px 20px;
      margin-top: 10px;
      border-radius: $circleRadiusSize;
      border: 1px solid $gray5-light;
    }
    .trends-optimization-label {
      color: #1d2129;
      font-weight: 400;
      font-size: 12px;
    }
  }
  .trends-container {
    width: 100%;
    height: 200px;
    .trends-bar {
      width: 80%;
      height: 100%;
    }
    .trends-ranking {
      width: 20%;
      margin-top: 5px;
      height: 90%;
      .trends-ranking-title {
        font-size: $mediumFontSize;
        font-size: 500;
      }
      .trends-ranking-item {
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
        .trends-ranking-bg {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
