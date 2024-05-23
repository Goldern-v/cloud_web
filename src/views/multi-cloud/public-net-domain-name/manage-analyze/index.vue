<template>
  <div class="ideal-large-margin manage-analyze-detail">
    <div class="manage-analyze-detail__header">
      <div class="flex-row manage-analyze-detail_back">
        <svg-icon icon="left-arrow" @click="goBack"></svg-icon>
        <el-divider direction="vertical" />
        <span>{{ detailInfo.name }}</span>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabControllers"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="manage-analyze-detail__tabs">
      <component :is="tabs[activeName]" v-bind="currentProps"></component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import analyzeREcord from './analyze-record/index.vue'
import batchImportExport from './batch-import-export.vue'
import tag from './tag.vue'

const router = useRouter()
const goBack = () => {
  router.back()
}

const detailInfo: any = ref({})
const route = useRoute()
onMounted(() => {
  detailInfo.value = JSON.parse(route.query.detail as any)
})

const activeName = ref('analyzeREcord')
const tabControllers = ref([
  { label: '解析记录', name: 'analyzeREcord' },
  { label: '批量导入/导出', name: 'batchImportExport' },
  { label: '标签', name: 'tag' }
])
const tabs: any = { analyzeREcord, batchImportExport, tag }
onMounted(() => {})
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
</script>
<style lang="scss" scoped>
.manage-analyze-detail {
  box-sizing: border-box;
}
.manage-analyze-detail__header {
  background-color: #fff;
  padding: 0 20px;
  .manage-analyze-detail_back {
    align-items: center;
    height: 40px;
  }
}
.manage-analyze-detail__tabs {
  margin: $idealMargin 0;
  padding: $idealPadding;
  background-color: #fff;
}
</style>
