<template>
  <div class="ideal-large-margin cloud-host-backup">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item of tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component
      :is="tabs[activeName]"
      v-bind="currentProps"
      class="ideal-large-margin-top"
    ></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './components/basic-info.vue'
import bindDisk from './components/bind-disk-list.vue'
import tag from './components/tag.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { basicInfo, bindDisk, tag }
// tabs标签页
const tabControllers = ref([
  { label: '详情', name: 'basicInfo' },
  { label: '绑定的磁盘', name: 'bindDisk' },
  { label: '标签', name: 'tag' }
])
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
.cloud-host-backup {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px;
    background-color: white;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>

