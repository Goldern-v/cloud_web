<template>
  <div class="monitor">
    <div class="ideal-tip-text">
      伸缩组健康数据为伸缩组内所有虚拟机实例的平均值。
    </div>

    <div class="flex-row ideal-default-margin-top" style="justify-content: space-between;align-items: center;">
      <div class="flex-row" style="align-items: center;">
        <el-radio-group v-model="range" class="ideal-default-margin-right">
          <el-radio-button
            v-for="(item, index) of rangeList"
            :key="index"
            :label="item.label"
            >{{ item.value }}</el-radio-button
          >
        </el-radio-group>

        <div class="monitor__time-range">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            @change="dateChange"
          />
        </div>

        <div class="ideal-default-margin-right">自动刷新</div>
        <el-switch v-model="autoRefresh"></el-switch>
      </div>

      <svg-icon icon="refresh-icon"/>
    </div>

    <div class="flex-row ideal-default-margin-top" style="align-items: center;">
      <div class="ideal-default-margin-right">周期</div>

      <el-select
        v-model="cycle"
        multiple
        placeholder="请选择"
        class="ideal-default-margin-right"
      >
        <el-option
          v-for="item in cycleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <div class="ideal-tip-text">当前监控数据为原始数据。</div>
    </div>

    <monitor-line :item="chartData" class="monitor-line ideal-default-margin-top"/>
  </div>
</template>

<script setup lang="ts">
import monitorLine from './monitor-line.vue'

const range = ref('')
const rangeList = [
  { label: '1', value: '近1小时' },
  { label: '2', value: '近3小时' },
  { label: '3', value: '近12小时' },
  { label: '4', value: '近24小时' },
  { label: '5', value: '近7天' },
  { label: '6', value: '近30天' }
]
const now = new Date()
const lastHour = new Date(now.getTime() - 60 * 60 * 1000)
const dateRange = ref<[Date, Date]>([lastHour, now]) //时间范围
const dateChange = (value: any) => {}

const autoRefresh = ref(false)
const cycle = ref('')
const cycleList = ref<any[]>([])

const chartData = {
  label: '实例数',
  max: '1',
  min: '0',
  chartId: 'instanceChart'
}
</script>

<style scoped lang="scss">
.monitor {
  padding: 0 $idealPadding $idealPadding;
  .monitor-line {
    width: 25%;
    height: 200px;
  }
  .monitor__time-range {
    margin-right: 10px;
    // 修改日期组件
    :deep(.el-date-editor.el-input__wrapper) {
      width: 200px;
      height: 34px;
    }
  }
}
</style>
