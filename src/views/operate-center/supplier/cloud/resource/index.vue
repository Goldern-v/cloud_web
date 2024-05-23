<template>
  <div class="ideal-main-container ideal-large-margin resource-pool-manage__detail">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) of tabControllers"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]"></component>
  </div>
</template>

<script setup lang="ts">
import aliyun from './aliyun/list.vue'
import amazon from './amazon/list.vue'

import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs = shallowRef<any>({
  aliyun,
  amazon
})

const tabControllers = ref([
  { label: '阿里云', name: 'aliyun' },
  { label: 'AWS', name: 'amazon' }
])

const activeName = ref('aliyun')
const active = shallowRef<any>(aliyun)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  active.value = tabs.value[tab.paneName!]
}

</script>

<style scoped lang="scss">
.resource-pool-manage__detail {
  box-sizing: border-box;
  background-color: white;
  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
  :deep(.el-tabs) {
    padding: 0 20px;
  }
  :deep(.el-tabs__header) {
    margin: 0;
  }
}
</style>
