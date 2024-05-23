<template>
  <div class="ideal-large-margin manage-net-detail">
    <el-tabs
      v-model="activeName"
      class="manage-net-detail__tabs"
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
      class="manage-net-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './basic-info.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { basicInfo }
// tabs标签页
const tabControllers = ref([{ label: '基本信息', name: 'basicInfo' }])
const activeName = ref('basicInfo')
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
.manage-net-detail {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .manage-net-detail__tabs {
    background-color: white;
  }
  .manage-net-detail__component {
    margin-top: 20px;
  }
}
</style>
