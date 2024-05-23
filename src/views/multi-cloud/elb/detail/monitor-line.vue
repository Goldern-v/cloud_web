<template>
  <div class="line">
    <div class="line-header">
      <div class="line-title">{{ item.label }}</div>
      <div class="flex-row" style="justify-content: space-between">
        <el-select v-model="unit" style="width: 20%">
          <el-option
            v-for="(ele, index) in item.unitOptions"
            :key="index"
            :label="ele"
            :value="ele"
          />
        </el-select>
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
    </div>
    <div :id="item.chartId" class="line-chart"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

interface LineChartProps {
  item?: any
}
const props = withDefaults(defineProps<LineChartProps>(), {
  item: () => ({})
})

type EChartsOption = echarts.EChartsOption
const option: EChartsOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      symbol: 'circle'
    }
  ]
}
const unit = computed(() => {
  return props.item.unit
})
const initEchart = () => {
  const echartDom = document.getElementById(props.item.chartId) as HTMLElement
  let myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
  myEchart.setOption(option)
}
//echart图自适应
window.addEventListener('resize', function () {
  const echartDom = document.getElementById(props.item.chartId) as HTMLElement
  let myEchart = echarts.init(echartDom)
  myEchart.resize()
})
onMounted(() => {
  initEchart()
})
</script>

<style scoped lang="scss">
.line {
  width: 100%;
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
      line-height: 25px;
    }
  }
  .line-chart {
    width: 100%;
    height: 90%;
  }
}
</style>
