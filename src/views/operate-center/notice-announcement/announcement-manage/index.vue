<template>
  <div class="ideal-main-container station-message">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item of tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component
      :is="tabs[activeName]"
      v-bind="currentProps"
    ></component>
  </div>
</template>

<script setup lang="ts">
import wait from './wait/list.vue'
import publicity from './publicity/list.vue'
import history from './history/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { wait, publicity, history }
// tabs标签页
const tabControllers = ref([
  { label: '待发布', name: 'wait' },
  { label: '公示列表', name: 'publicity' },
  { label: '发布历史', name: 'history' }
])
const activeName = ref('wait')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'basicInfo') {
    currentProps.value = { uuid: 'test' }
  }
})
</script>

<style scoped lang="scss">
.station-message {
  background-color: white;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>

