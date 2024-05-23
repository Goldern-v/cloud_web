<template>
  <div class="ideal-main-container elastic-flex-instance">
    <el-tabs v-model="activeName">
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
    ></component>
  </div>
</template>

<script setup lang="ts">
import group from './group/list.vue'
import config from './config/list.vue'

// 标签页组件
const tabs: any = { group, config }
// tabs标签页
const tabControllers = ref([
  { label: '弹性伸缩组', name: 'group' },
  { label: '伸缩配置', name: 'config' }
])
const activeName = ref('group')

</script>

<style scoped lang="scss">
.elastic-flex-instance {
  background-color: white;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  // 修改分割线颜色
  // :deep(.el-divider--vertical) {
  //   border-left: 1px var(--el-color-primary) solid;
  // }
}
</style>

