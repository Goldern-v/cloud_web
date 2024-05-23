<template>
  <div class="flow">
    <div class="flex-row">
      <el-radio-group v-model="timeSelect" class="ideal-default-margin-right" @change="timeChange">
        <el-radio-button
          v-for="(item, index) in timeList"
          :key="index"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>

      <div class="ideal-default-margin-right">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
          @change="dateChange"
        />
      </div>

      <el-button link type="primary"
        >查看更多监控指标详情</el-button
      >
    </div>

    <line-view
      v-for="(item, index) of flowData"
      :key="index"
      ref="chart"
      :item="item"
      :statistics-data="item.statisticsData"
      :statistics-value="item.statisticsValue"
      class="flow-chart ideal-middle-margin-top"
    />
  </div>
</template>

<script setup lang="ts">
import lineView from '../components/line.vue'

//监控信息
const flowData = ref<any[]>([])
onMounted(() => {
  flowData.value = [
    { statisticsValue: [], statisticsData: [], cnName: '流量趋势', enName: 'test1', max: 100, min: 2 }
  ]
})
/**
 * 初始化赋值时间，监听时间变化请求监控数据
 */
const timeSelect = ref<number | null>(1)
const now = new Date()
const lastHour = new Date(now.getTime() - 60 * 60 * 1000)
const dateRange = ref<[Date, Date]>([lastHour, now]) //时间范围

const dateChange = (val: any) => {
  timeSelect.value = null
}

const timeList = [
  { label: '近1小时', type: 'h', value: 1 },
  { label: '近3小时', type: 'h', value: 3 },
  { label: '近12小时', type: 'h', value: 12 },
  { label: '近24小时', type: 'h', value: 24 },
  { label: '近7天', type: 'd', value: 7 },
  { label: '近30天', type: 'd', value: 30 }
]

const timeChange = (time: any) => {
  const obj = timeList.find(item => item.value === time)
  if (obj) {
    const to = new Date()
    const from =
      obj?.type === 'h'
        ? new Date(to.getTime() - obj.value * 3600000)
        : new Date(to.getTime() - obj.value * 24 * 3600000)
    dateRange.value = [from, to]
  }
}

</script>

<style scoped lang="scss">
.flow {
  background-color: white;
  padding: $idealPadding;
  .flow-chart {
    width: calc(100% - 40px);
    height: 250px;
    padding: $idealPadding;
  }
}
</style>
