<template>
  <div class="ideal-large-margin cloud-host-detail">
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
      @clickDetailType="clickDetailType"
    ></component>
  </div>
</template>

<script setup lang="ts">
import overview from './overview.vue'
import ecs from './ecs.vue'
import backup from './backup.vue'
import snapshot from './snapshot.vue'
import tag from './tag.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { overview, ecs, backup, snapshot, tag }
// tabs标签页
const tabControllers = ref([
  { label: '概览信息', name: 'overview' },
  { label: '云服务器', name: 'ecs' },
  { label: '备份', name: 'backup' },
  { label: '快照', name: 'snapshot' },
  { label: '标签', name: 'tag' }
])
const activeName = ref('overview')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const clickDetailType = (type: string) => {
  activeName.value = type
}
</script>

<style scoped lang="scss">
.cloud-host-detail {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
    background-color: white;
    padding: 0 $idealPadding;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
