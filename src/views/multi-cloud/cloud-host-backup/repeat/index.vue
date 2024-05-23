<template>
  <div class="cloud-host-backup">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
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
import backup from './backup.vue'
import share from './share.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { backup, share }
// tabs标签页
const tabControllers = ref([
  { label: '备份', name: 'backup' },
  { label: '共享给我的备份', name: 'share' }
])
const activeName = ref('backup')
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
.cloud-host-backup {
  width: 100%;
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

