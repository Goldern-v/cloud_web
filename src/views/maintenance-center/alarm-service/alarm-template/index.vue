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
    <component
      :is="tabs[activeName]"
      @clickRefreshEvent="clickRefreshEvent"
    ></component>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import customAlarmTemplate from './custom-alarm-template/index.vue'
import defaultAlarmTemplate from './default-alarm-template/index.vue'
// 标签页组件
const tabs: any = { customAlarmTemplate, defaultAlarmTemplate }
const activeName = ref('')
const tabOptions = ref<any[]>([
  { label: '默认告警模板', name: 'defaultAlarmTemplate' },
  { label: '自定义告警模板', name: 'customAlarmTemplate' }
])
const tabClick = (tab: TabsPaneContext) => {
  console.log(tab)
}

const route = useRoute()
onMounted(() => {
  activeName.value = route.query.type
    ? (route.query.type as string)
    : 'defaultAlarmTemplate'
})

const clickRefreshEvent = () => {
  activeName.value = 'customAlarmTemplate'
}
</script>
<style lang="scss" scoped>
.alarm-record {
  padding: $idealPadding;
}
</style>
