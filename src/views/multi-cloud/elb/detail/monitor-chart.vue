<template>
  <div class="monitor">
    <el-form :model="form" label-position="left">
      <el-form-item label="监控粒度">
        <el-radio-group v-model="form.monitor">
          <el-radio-button
            v-for="item of granularityList"
            :key="item.label"
            type="text"
            :label="item.label"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="时间范围">
        <div
          class="flex-row"
          style="width: 100%; justify-content: space-between"
        >
          <div class="flex-row" style="align-items: center">
            <el-radio-group
              v-model="timeSelect"
              size="small"
              class="ideal-default-margin-right"
              @change="timeChange"
            >
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

            <div class="ideal-default-margin-right">自动刷新</div>

            <el-switch></el-switch>
          </div>

          <div>
            <ideal-button-events
              class="ideal-default-margin-right"
              :right-btns="rightButtons"
              @clickRightEvent="clickRightEvent"
            >
            </ideal-button-events>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="&nbsp">
        <div>
          <span class="ideal-default-margin-right">周期</span>
          <el-select v-model="form.cycle" class="ideal-default-margin-right">
            <el-option
              v-for="(item, index) in cycleList"
              :key="index"
            ></el-option>
          </el-select>
          <span class="ideal-tip-text ideal-default-margin-right"
            >当前监控数据为原始数据。</span
          >
          <span style="color: var(--el-color-primary)">查看更多指标详情</span>
        </div>
        <div class="monitor-chart">
          <monitor-line
            v-for="(item, index) of lineData"
            v-show="item.select"
            :key="index"
            :item="item"
            class="monitor-chart-line"
          />
        </div>
      </el-form-item>
    </el-form>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :select-monitor-indicator="lineData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import MonitorLine from './monitor-line.vue'
import type { IdealButtonEventProp } from '@/types'
import { OperateEventEnum } from '@/utils/enum'
import dialogBox from '../dialog-box.vue'

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

const rightButtons: IdealButtonEventProp[] = [
  { title: '设置监控指标', prop: 'monitor' },
  { title: '', prop: 'refresh', icon: 'refresh-icon' }
]

const form = reactive({
  monitor: 'elb',
  cycle: ''
})

//所有监控指标
const monitorTag = [
  {
    label: '入网带宽',
    chartId: 'bandwidth_access',
    max: 184.12,
    min: 150.21,
    average: 160.98,
    unit: 'bit/s',
    select: true,
    unitOptions: ['bit/s', 'kb/s']
  },
  {
    label: '入网带宽频率',
    chartId: 'bandwidth_frequency_access',
    max: 184.12,
    min: 150.21,
    average: 160.98,
    unit: 'bit/s',
    select: true,
    unitOptions: ['bit/s', 'kb/s']
  },
  {
    label: '入网流量',
    chartId: 'traffic_incoming',
    max: 184.12,
    min: 150.21,
    average: 160.98,
    unit: 'bit/s',
    select: true,
    unitOptions: ['bit/s', 'kb/s']
  },
  {
    label: '出网带宽',
    chartId: 'bandwidth_outbound',
    max: 184.12,
    min: 150.21,
    average: 160.98,
    unit: 'bit/s',
    select: true,
    unitOptions: ['bit/s', 'kb/s']
  },
  {
    label: '出网带宽使用率',
    chartId: 'bandwidth_outbound_usage',
    max: 184.12,
    min: 150.21,
    average: 160.98,
    unit: 'bit/s',
    select: true,
    unitOptions: ['bit/s', 'kb/s']
  }
]
const lineData: any = ref([]) //选中监控指标

onMounted(() => {
  lineData.value = monitorTag
})

const granularityList = [
  { name: '负载均衡器', label: 'elb' },
  { name: '监听器', label: 'monitor' }
]

const cycleList: any = []

//弹窗
const showDialog = ref(false)
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = (tags?: any) => {
  showDialog.value = false
  //展示选中监控指标
  lineData.value = monitorTag.filter((item: any) =>
    tags.value.some((ele: any) => ele.chartId === item.chartId)
  )
}
const dialogType = ref<OperateEventEnum>()
const clickRightEvent = (value: string | number | object) => {
  if (value === 'monitor') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.monitor
  }
}
</script>

<style scoped lang="scss">
.monitor {
  margin: $idealMargin 0;
  background-color: #fff;
  // padding: $idealPadding;
  .ideal-default-margin-right {
    margin-right: 10px;
  }
  .custom-btn {
    border-radius: $circleRadiusSize;
    cursor: pointer;
    align-items: center;
    text-align: center;
    padding: 8px 12px;
    margin-right: 10px;
    border: 1px solid $gray5-light;
  }
  .monitor-chart {
    display: flex;
    flex-wrap: wrap;
    .monitor-chart-line {
      width: calc(33% - 20px);
      height: 350px;
      margin: 20px 20px 20px 0;
    }
  }
}
</style>
