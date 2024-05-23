<template>
  <div class="ideal-large-margin vdc-detail">
    <el-tabs
      v-model="activeName"
      class="vdc-detail__tabs"
      @tab-click="handleClick"
    >
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
      class="vdc-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import overview from './overview/index.vue'
import user from './user/index.vue'
import resourcePool from './resource-pool/index.vue'
import resourceQuota from './resource-quota/index.vue'
import nameNorm from './name-norm/index.vue'
import budget from './budget/index.vue'
import costCenter from './cost-center/index.vue'
import balanceConfig from './balance-config/index.vue'
import approve from './approve/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = {
  overview,
  user,
  resourcePool,
  resourceQuota,
  nameNorm,
  budget,
  costCenter,
  balanceConfig,
  approve
}
// tabs标签页
const tabControllers = ref([
  { label: '概览', name: 'overview' },
  { label: '用户', name: 'user' },
  { label: '资源池', name: 'resourcePool' },
  { label: '资源配额', name: 'resourceQuota' },
  { label: '命名规范', name: 'nameNorm' },
  { label: '预算配置', name: 'budget' },
  { label: '成本中心', name: 'costCenter' },
  { label: '余额配置', name: 'balanceConfig' },
  { label: '审批和计费配置', name: 'approve' }
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
.vdc-detail {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 5px 20px 0;
  }
  :deep .el-tabs__item {
    margin-bottom: 5px;
  }
  .vdc-detail__tabs {
    background-color: white;
    border-radius: 2px;
    box-shadow: 0 0 5px 2px rgba($color: #333333, $alpha: 0.1);
  }
  .vdc-detail__component {
    margin-top: 20px;
    box-shadow: 0 0 5px 2px rgba($color: #333333, $alpha: 0.1);
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
}
</style>
