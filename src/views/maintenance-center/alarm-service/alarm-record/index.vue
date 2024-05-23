<template>
  <div class="ideal-main-container alarm-record">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane
        v-for="tab in tabOptions"
        :key="tab"
        :label="tab.label"
        :name="tab.name"
      ></el-tab-pane>
    </el-tabs>
    <component :is="tabs[activeName]"></component>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import currentAlarm from './current-alarm.vue'
import alarmHistory from './alarm-history.vue'
// 标签页组件
const tabs: any = { currentAlarm, alarmHistory }
const activeName = ref('currentAlarm')
const tabOptions = ref<any[]>([
  { label: '当前告警', name: 'currentAlarm' },
  { label: '告警历史', name: 'alarmHistory' }
])
const tabClick = (tab: TabsPaneContext) => {
  console.log(tab)
}
</script>
<style lang="scss" scoped>
.alarm-record {
  padding: $idealPadding;
}
</style>
