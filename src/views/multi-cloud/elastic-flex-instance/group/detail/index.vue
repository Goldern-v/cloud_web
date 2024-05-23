<template>
  <div class="ideal-large-margin elastic-flex-instance-detail">
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
import overview from './overview/index.vue'
import monitor from './monitor/index.vue'
import flexInstance from './flex-instance/index.vue'
import history from './history/index.vue'
import flexPolicy from './flex-policy/index.vue'
import inform from './inform/index.vue'
import tag from './tag/index.vue'
import lifecycle from './lifecycle/index.vue'

// 标签页组件
const tabs: any = { overview, monitor, flexInstance, history, flexPolicy, inform, tag, lifecycle }
// tabs标签页
const tabControllers = ref([
  { label: '概览', name: 'overview' },
  { label: '监控', name: 'monitor' },
  { label: '伸缩实例', name: 'flexInstance' },
  { label: '活动历史', name: 'history' },
  { label: '伸缩策略', name: 'flexPolicy' },
  // { label: '通知', name: 'inform' },
  { label: '标签', name: 'tag' },
  { label: '生命周期挂钩', name: 'lifecycle' }
])
const activeName = ref('overview')

</script>

<style scoped lang="scss">
.elastic-flex-instance-detail {
  box-sizing: border-box;
  background-color: white;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>

