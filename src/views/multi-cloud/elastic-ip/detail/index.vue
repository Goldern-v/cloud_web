<template>
  <div class="ideal-large-margin eip-detail">
    <div class="eip-detail__header">
      <div class="flex-row eip-detail_back">
        <svg-icon icon="left-arrow" @click="goBack"></svg-icon>
        <el-divider direction="vertical" />
        <span>{{ ipAddress }}</span>
      </div>
      <div class="eip-detail__tabs">
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
    <component :is="tabs[activeName]" v-bind="currentProps"></component>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import basicInfo from './basic-Info.vue'
import bandwidth from './bandwidth.vue'
import tag from './tag.vue'

const router = useRouter()
const goBack = () => {
  router.back()
}

const route = useRoute()
const ipAddress = route.query.ipAddress as string

const activeName = ref('basicInfo')
const tabControllers = ref([
  { label: '基本信息', name: 'basicInfo' },
  { label: '带宽', name: 'bandwidth' },
  { label: '标签', name: 'tag' }
])
const tabs: any = { basicInfo, bandwidth, tag }
onMounted(() => {
  // ipAddress.value =
})
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
</script>
<style lang="scss" scoped>
.eip-detail {
  box-sizing: border-box;
}
.eip-detail__header {
  background-color: #fff;
  padding: 0 20px;
  .eip-detail_back {
    align-items: center;
    height: 40px;
    font-weight: 600;
  }
  .clickLeftEvent {
    padding: 20px 0;
    background-color: #fff;
  }
}
</style>
