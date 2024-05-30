<template>
  <div class="ideal-large-margin route-table">
    <el-tabs
      v-model="activeName"
      class="route-table__tabs"
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
      class="route-table__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './components/basic-info.vue'
import associateSubnet from './components/associate-subnet-list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { basicInfo, associateSubnet }
// tabs标签页
const tabControllers = ref([
  { label: '基本信息', name: 'basicInfo' },
  { label: '关联子网', name: 'associateSubnet' }
])
const activeName = ref('basicInfo')

const route = useRoute()
onMounted(() => {
  activeName.value = (route.query?.type as string) || 'basicInfo'
})
const handleClick = (tab: TabsPaneContext, event: Event) => {}

// 当前组件需要的传参
const currentProps = ref()
</script>

<style scoped lang="scss">
.route-table {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .route-table__tabs {
    background-color: white;
  }
  .route-table__component {
    margin-top: 20px;
  }
}
</style>
