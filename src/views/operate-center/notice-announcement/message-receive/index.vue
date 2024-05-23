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
import finance from './finance/list.vue'
import ops from './ops/list.vue'
import product from './product/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { finance, ops, product }
// tabs标签页
const tabControllers = ref([
  { label: '财务消息', name: 'finance' },
  { label: '运维消息', name: 'ops' },
  { label: '产品消息', name: 'product' }
])
const activeName = ref('finance')
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

