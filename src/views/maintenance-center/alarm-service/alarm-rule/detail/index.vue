<template>
  <div class="ideal-large-margin alarm-rule-detail">
    <el-tabs
      v-model="activeName"
      class="alarm-rule-detail__tabs"
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
      class="alarm-rule-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import detailInfo from './detailInfo.vue'
import history from './history.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { detailInfo, history }
// tabs标签页
const tabControllers = ref([
  { label: '详细信息', name: 'detailInfo' },
  { label: '告警历史', name: 'history' }
])
const activeName = ref('detailInfo')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'detailInfo') {
    currentProps.value = { uuid: 'test' }
  }
})
</script>

<style scoped lang="scss">
.alarm-rule-detail {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .alarm-rule-detail__tabs {
    background-color: white;
  }
  .alarm-rule-detail__component {
    margin-top: 20px;
  }
}
</style>
