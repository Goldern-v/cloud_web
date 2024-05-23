<template>
  <div class="ideal-main-container expense-optimize">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane
        v-for="tab in tabOptions"
        :key="tab"
        :label="tab.label"
        :name="tab.name"
      ></el-tab-pane>
    </el-tabs>
    <component :is="tabs[activeName]"></component>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import checkHistory from './check-history/index.vue'
import optimizeStrategy from './optimize-strategy/index.vue'
// 标签页组件
const tabs: any = { checkHistory, optimizeStrategy }
const activeName = ref('')
const tabOptions = ref<any[]>([
  { label: '检查历史', name: 'checkHistory' },
  { label: '优化策略', name: 'optimizeStrategy' }
])
const tabClick = (tab: TabsPaneContext) => {
  console.log(tab)
}
const route = useRoute()
onMounted(() => {
  const type = route.query.type
  activeName.value = type ? 'optimizeStrategy' : 'checkHistory'
})
</script>
<style lang="scss" scoped>
.expense-optimize {
  padding: 20px;
}
</style>
