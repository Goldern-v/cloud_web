<template>
  <div class="monitor">
    <div class="flex-row" style="justify-content: space-between">
      <div class="flex-row" style="align-items: center">
        <el-radio-group v-model="timeSelect" class="ideal-default-margin-right">
          <el-radio-button label="近1小时" />
          <el-radio-button label="近3小时" />
          <el-radio-button label="近12小时" />
          <el-radio-button label="近24小时" />
          <el-radio-button label="近7天" />
          <el-radio-button label="近30天" />
        </el-radio-group>

        <div class="ideal-default-margin-right">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </div>

        <div class="ideal-default-margin-right">自动刷新</div>

        <el-switch></el-switch>
      </div>

      <div class="flex-row">
        <ideal-button-events
          class="ideal-default-margin-right"
          :right-btns="rightButtons"
          @clickRightEvent="clickRightEvent"
        >
        </ideal-button-events>
      </div>
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

const timeSelect = ref('')
const dateRange = ref('')
const rightButtons: IdealButtonEventProp[] = [
  { title: '设置监控指标', prop: 'monitor' },
  { title: '', prop: 'refresh', icon: 'refresh-icon' }
]

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

//弹窗
const showDialog = ref(false)
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = (tags: any) => {
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
