<template>
  <div class="ideal-main-container cloud-disk-backup">
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
    ></component>
  </div>
</template>

<script setup lang="ts">
import storage from './storage/list.vue'
import backup from './repeat/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { storage, backup }
// tabs标签页
const tabControllers = ref([
  { label: '存储库', name: 'storage' },
  { label: '备份副本', name: 'backup' }
])
const activeName = ref('storage')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style scoped lang="scss">
.cloud-disk-backup {
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

