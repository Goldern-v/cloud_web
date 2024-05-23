<template>
  <div class="ideal-main-container menu-manage">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabControllers"
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
import builtIn from './built-in/list.vue'
import external from './external/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { builtIn, external }
// tabs标签页
const tabControllers = ref([
  { label: '内置菜单配置', name: 'builtIn' },
  { label: '菜单接入', name: 'external' }
])
const activeName = ref('builtIn')
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
.menu-manage {
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

