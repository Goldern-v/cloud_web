<template>
  <div class="object-detail">
    <div class="object-detail__tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabControllers"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </div>

    <component
      :is="tabs[activeName]"
      class="object-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import flow from './flow/index.vue'
import request from './request/index.vue'
import storage from './storage/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { storage, flow, request }

// tabs标签页
const tabControllers = ref([
  { label: '存储', name: 'storage' },
  { label: '流量', name: 'flow' },
  { label: '请求', name: 'request' }
])
const activeName = ref('storage')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

</script>

<style scoped lang="scss">
.object-detail {
  width: 100%;
  .object-detail__tabs {
    background-color: white;
    padding: $idealPadding $idealPadding 0;
    // 修改tabs底部边距
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
