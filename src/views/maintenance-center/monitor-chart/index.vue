<template>
  <div class="monitor">
    <div class="flex-row" style="justify-content: space-between">
      <div class="flex-row" style="align-items: center">
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
      </div>

      <div class="flex-row custom-button" @click="setMonitor">
        <span>设置监控</span>
      </div>
    </div>

    <div class="monitor-chart">
      <monitor-line
        v-for="(item, index) of monitorData"
        :key="index"
        ref="chart"
        :item="item"
        :statistics-value="item.statisticsValue"
        class="monitor-chart-line"
      />
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :select-monitor-indicator="monitorData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import monitorLine from './monitor-line.vue'
import dialogBox from './dialog-box.vue'
import { OperateEventEnum } from '@/utils/enum'
import { instanceMonitor } from './monitor-data'

const route = useRoute()
const detail = JSON.parse(route.query.data as any)

//产品监控数据
const {
  queryInstanceMonitorIndicators, //请求监控指标
  monitorData //监控数据
} = instanceMonitor()

onMounted(() => {
  queryInstanceMonitorIndicators(detail, dateRange)
})

const chart = ref()

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

watch(
  () => dateRange,
  val => {
    queryInstanceMonitorIndicators(detail, val)
  },
  { deep: true }
)

/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()

//点击设置监控项
const setMonitor = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.monitor
}
//取消
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  //设置成功查询监控项
  queryInstanceMonitorIndicators(detail, dateRange)
}
</script>

<style scoped lang="scss">
.monitor {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  padding: $idealPadding;
  background-color: white;
  .custom-button {
    border: 1px solid var(--el-color-primary);
    border-radius: $circleRadiusSize;
    color: var(--el-color-primary);
    cursor: pointer;
    align-items: center;
    padding: 0 12px;
    &:hover {
      background-color: var(--theme-menu-hover-bg-color);
    }
  }
  .monitor-chart {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 10px;
    .monitor-chart-line {
      width: calc(33% - 20px);
      height: 250px;
      margin: 20px 20px 0 0;
    }
  }
  :deep(.el-radio-button__inner) {
    width: 100px;
  }
}
</style>
