<template>
  <div class="ideal-large-margin tls-safe-policy">
    <div class="tls-safe-policy__tabs">
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
      class="tls-safe-policy__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import custom from './custom/list.vue'
import defaultPolicy from './default/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { custom, defaultPolicy }

// tabs标签页
const tabControllers = ref([
  { label: '自定义策略', name: 'custom' },
  { label: '默认策略', name: 'defaultPolicy' }
])
const activeName = ref('custom')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

</script>

<style scoped lang="scss">
.tls-safe-policy {
  box-sizing: border-box;
  .tls-safe-policy__tabs {
    background-color: white;
    padding: $idealPadding $idealPadding 0;
    // 修改tabs底部边距
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
  .tls-safe-policy__component {
    // margin-top: $idealMargin;
  }
  // 修改分割线颜色
  // :deep(.el-divider--vertical) {
  //   border-left: 1px var(--el-color-primary) solid;
  // }
}
</style>
