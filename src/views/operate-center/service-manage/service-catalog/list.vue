<template>
  <div class="ideal-main-container expense-optimize">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane
        v-for="tab in tabOptions"
        :key="tab"
        :label="tab.name"
        :name="tab.id"
      >
      </el-tab-pane>
    </el-tabs>
    <all-service :service-catalog-type="activeName"></all-service>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import allService from './all-service.vue'
import { serviceCategoryTagList } from '@/api/java/operate-center'

// 标签页组件
const activeName = ref('')
const tabOptions = ref<any[]>([
])
const tabClick = (tab: TabsPaneContext) => {}

onMounted(() => {
  getServiceCategoryTagList()
})
const getServiceCategoryTagList = () => {
  serviceCategoryTagList().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      tabOptions.value = data
      if (data.length) {
        activeName.value = data[0].id
      }
    } else {
      tabOptions.value = []
    }
  }).catch(_ => {
    tabOptions.value = []
  })
}
</script>
<style lang="scss" scoped>
.expense-optimize {
  padding: $idealPadding;
}
</style>
