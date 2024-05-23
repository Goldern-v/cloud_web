<template>
  <div class="ideal-large-margin project-manage-detail">
    <el-tabs v-model="activeName" class="project-manage-detail__tabs" @tab-click="handleClick">
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
      class="project-manage-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import overview from './overview/index.vue'
import relateRole from './relate-role/index.vue'
import relateVdc from './relate-vdc/index.vue'
import relateProject from './relate-project/index.vue'
import budgetQuota from './budget-quota/index.vue'
import authorized from './authorized/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { overview, relateRole, relateVdc, relateProject, budgetQuota, authorized }
// tabs标签页
const tabControllers = ref([
  { label: '概览', name: 'overview' },
  { label: '关联角色', name: 'relateRole' },
  { label: '关联VDC', name: 'relateVdc' },
  { label: '关联项目', name: 'relateProject' },
  { label: '预算配额', name: 'budgetQuota' },
  { label: '授权平台', name: 'authorized' }
])
const activeName = ref('overview')
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
.project-manage-detail {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .project-manage-detail__tabs {
    background-color: white;
  }
  .project-manage-detail__component {
    margin-top: 0px;
  }
}
</style>
