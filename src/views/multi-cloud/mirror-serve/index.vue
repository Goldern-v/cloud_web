<template>
  <div class="ideal-main-container mirror-serve-backup" :style="{'margin-bottom': isPublic ? '60px' : '20px'}">
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
    ></component>
  </div>
</template>

<script setup lang="ts">
import privateList from './private/list.vue'
import publicList from './public/list.vue'
import shareList from './share/list.vue'

import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { publicList, privateList, shareList }
// tabs标签页
const tabControllers = ref([
  { label: '公共镜像', name: 'publicList' },
  { label: '私有镜像', name: 'privateList' },
  { label: '共享镜像', name: 'shareList' }
])
const activeName = ref('publicList')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const isPublic = computed(() => activeName.value === 'publicList')
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'basicInfo') {
    currentProps.value = { uuid: 'test' }
  }
})
</script>

<style scoped lang="scss">
.mirror-serve-backup {
  padding: $idealPadding;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  // :deep(.el-tabs) {
  //   padding: 10px 20px;
  // }
  // 修改分割线颜色
  // :deep(.el-divider--vertical) {
  //   border-left: 1px var(--el-color-primary) solid;
  // }
}
</style>

