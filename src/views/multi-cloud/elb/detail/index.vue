<template>
  <div class="ideal-large-margin eip-detail">
    <div class="eip-detail__header">
      <div class="flex-row eip-detail_back">
        <svg-icon icon="left-arrow" @click="goBack"></svg-icon>
        <el-divider direction="vertical" />
        <div>
          <span style="color: var(--el-color-primary)">弹性负载均衡/</span>
          负载均衡实例({{ elbName }})<span class="mr10">{{ elbStatus }}</span>
        </div>
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
import listener from './listener.vue'
import monitorChart from './monitor-chart.vue'
import accessLog from './log.vue'
import tag from './tag.vue'

const router = useRouter()
const goBack = () => {
  router.back()
}

const elbName = ref('elb-978a')
const elbStatus = ref('运行中')

const activeName = ref('')
const tabControllers = ref([
  { label: '基本信息', name: 'basicInfo' },
  { label: '监听器', name: 'listener' },
  { label: '监控', name: 'monitorChart' },
  { label: '访问日志', name: 'accessLog' },
  { label: '标签', name: 'tag' }
])
const tabs: any = { basicInfo, listener, monitorChart, accessLog, tag }

const route = useRoute()
onMounted(() => {
  activeName.value = route.query.type === 'log' ? 'accessLog' : 'basicInfo'
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
  }
  .clickLeftEvent {
    padding: 20px 0;
    background-color: #fff;
  }
}
</style>
