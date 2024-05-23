<template>
  <div class="ideal-main-container alarm-record">
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
import contactPerson from './contact-person/index.vue'
import contactGroup from './contact-group/index.vue'
// 标签页组件
const tabs: any = { contactPerson, contactGroup }
const activeName = ref('contactPerson')
const tabOptions = ref<any[]>([
  { label: '通知联系人', name: 'contactPerson' },
  { label: '通知联系组', name: 'contactGroup' }
])
const tabClick = (tab: TabsPaneContext) => {
  console.log(tab)
}
</script>
<style lang="scss" scoped>
.alarm-record {
  padding: $idealPadding;
}
</style>
