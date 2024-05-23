<template>
  <div class="ideal-main-container elastic-net-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]" v-bind="currentProps"></component>
  </div>
</template>

<script setup lang="ts">
import AssistList from './assist/list.vue'
import MainList from './main/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { AssistList, MainList }
// tabs标签页
const tabControllers = ref([
  { label: '弹性网卡', name: 'MainList' },
  { label: '辅助弹性网卡', name: 'AssistList' }
])
const activeName = ref('MainList')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const route = useRoute()
onMounted(() => {
  if (route.query.type) {
    activeName.value =
      (route.query.type as string) === 'MAIN_CARD' ? 'MainList' : 'AssistList'
  }
})
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'basicInfo') {
    currentProps.value = { uuid: 'test' }
  }
})
</script>

<style scoped lang="scss">
.elastic-net-card {
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
