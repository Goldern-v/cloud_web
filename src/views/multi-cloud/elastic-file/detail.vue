<template>
  <div class="ideal-large-margin detail">
    <div class="detail__tabs">
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
      class="detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './components/basic-info.vue'
import permission from './components/permission.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { basicInfo, permission }

// tabs标签页
const tabControllers = ref([
  { label: '基本信息', name: 'basicInfo' },
  { label: '权限列表', name: 'permission' }
])
const activeName = ref('basicInfo')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

</script>

<style scoped lang="scss">
.detail {
  box-sizing: border-box;
  .detail__tabs {
    background-color: white;
    padding: $idealPadding $idealPadding 0;
    // 修改tabs底部边距
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
  .detail__component {
    margin-top: $idealMargin;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
