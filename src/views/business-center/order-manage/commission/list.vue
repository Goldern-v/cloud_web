<template>
  <div class="ideal-main-container mine-work-order">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]" v-bind="currentProps"></component>
  </div>
</template>

<script setup lang="ts">
import approve from './approve/list.vue'
import pay from './pay/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { approve, pay }
// tabs标签页
const tabControllers = ref([
  { label: '待审批', name: 'approve' },
  { label: '待支付', name: 'pay' }
])
const activeName = ref('approve')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'approve') {
    currentProps.value = { uuid: 'test' }
  }
})
</script>

<style scoped lang="scss">
.mine-work-order {
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
