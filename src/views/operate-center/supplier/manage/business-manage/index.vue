<template>
  <div class="ideal-large-margin port-info">
    <el-tabs
      v-model="activeName"
      class="port-info__tabs"
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
      class="port-info__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import DCI from './DCI/index.vue'
import cloudPort from './cloud-port/index.vue'
import specificPort from './specific-port/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { DCI, cloudPort, specificPort }
// tabs标签页
const tabControllers = ref([
  { label: '云端口', name: 'cloudPort' },
  { label: '专用端口', name: 'specificPort' },
  { label: 'DCI', name: 'DCI' }
])
const activeName = ref('cloudPort')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'cloudPort') {
    currentProps.value = { uuid: 'test' }
  }
})
</script>

<style scoped lang="scss">
.port-info {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .port-info__tabs {
    background-color: white;
  }
  .port-info__component {
    margin-top: 20px;
  }
}
</style>
