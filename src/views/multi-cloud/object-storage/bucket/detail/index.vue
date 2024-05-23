<template>
  <div class="ideal-large-margin bucket-detail">
    <div class="bucket-detail__tabs">
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
      class="bucket-detail__component"
      @clickConfig="clickConfig"
    ></component>
  </div>
</template>

<script setup lang="ts">
import overview from '../../overview/index.vue'
import object from '../../object/index.vue'
import statistics from '../../statistics/index.vue'
import accessControl from '../../access-control/index.vue'
import basicConfig from '../../basic-config/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { overview, object, statistics, accessControl, basicConfig }

// tabs标签页
const tabControllers = ref([
  { label: '概览', name: 'overview' },
  { label: '对象', name: 'object' },
  { label: '用量统计', name: 'statistics' },
  { label: '访问控制权限', name: 'accessControl' },
  { label: '基础配置', name: 'basicConfig' }
])
const activeName = ref('overview')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 跳转访问控制权限
const clickConfig = () => {
  activeName.value = 'accessControl'
}
</script>

<style scoped lang="scss">
.bucket-detail {
  box-sizing: border-box;
  .bucket-detail__tabs {
    background-color: white;
    padding: $idealPadding $idealPadding 0;
    // 修改tabs底部边距
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
  .bucket-detail__component {
    margin-top: $idealMargin;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
