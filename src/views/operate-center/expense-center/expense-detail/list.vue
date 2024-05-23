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
import billingDetail from './billing-detail.vue'
import billingNoteDetail from './billing-note-detail.vue'
// 标签页组件
const tabs: any = { billingDetail, billingNoteDetail }
const activeName = ref('billingDetail')
const tabOptions = ref<any[]>([
  { label: '账单明细', name: 'billingDetail' },
  { label: '计费单明细', name: 'billingNoteDetail' }
])
const tabClick = (tab: TabsPaneContext) => {}
</script>
<style lang="scss" scoped>
.expense-optimize {
  padding: 20px;
}
</style>
