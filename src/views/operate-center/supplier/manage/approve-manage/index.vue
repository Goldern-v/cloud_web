<template>
  <div class="ideal-large-margin approve-manage">
    <el-tabs
      v-model="activeName"
      class="approve-manage__tabs"
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
      class="approve-manage__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import passed from './passed.vue'
import rejected from './rejected.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { passed, rejected }
// tabs标签页
const tabControllers = ref([
  // { label: '待审批', name: 'pendApprove' },
  { label: '已通过', name: 'passed' },
  { label: '已驳回', name: 'rejected' }
])
const activeName = ref('passed')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
</script>

<style scoped lang="scss">
.approve-manage {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .approve-manage__tabs {
    background-color: white;
  }
  .approve-manage__component {
    margin-top: 20px;
  }
}
</style>
