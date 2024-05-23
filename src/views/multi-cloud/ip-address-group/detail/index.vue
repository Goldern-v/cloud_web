<template>
  <div class="ideal-large-margin ip-address-detail">
    <div class="ip-address-detail__header">
      <div class="flex-row ip-address-detail_back">
        <svg-icon icon="left-arrow" @click="goBack"></svg-icon>
        <el-divider direction="vertical" />
        <span>{{ detailInfo.name }}</span>
      </div>

      <el-card class="ideal-large-margin-top">
        <ideal-detail-info
          :label-array="labelArray"
          label-position="left"
          :show-colon="false"
          :detail-info="detailInfo"
        >
        </ideal-detail-info>
      </el-card>

      <el-card class="ideal-large-margin-top">
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
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import ipAddress from './ip-address.vue'
import associateMonitor from './associate-monitor.vue'

const router = useRouter()
const goBack = () => {
  router.back()
}

const detailInfo: any = ref({})
const route = useRoute()
onMounted(() => {
  detailInfo.value = JSON.parse(route.query.detail as any)
})

const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: '创建时间', prop: 'createDate' },
  { label: 'ID', prop: 'uuid', isCopy: true },
  { label: '描述', prop: 'remark', isEdit: true }
])

const activeName = ref('ipAddress')
const tabControllers = ref([
  { label: 'IP地址', name: 'ipAddress' },
  { label: '关联监听器', name: 'associateMonitor' }
])
const tabs: any = { ipAddress, associateMonitor }
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
.ip-address-detail {
  box-sizing: border-box;
}
.ip-address-detail__header {
  .ip-address-detail_back {
    align-items: center;
    height: 40px;
    background-color: #fff;
    padding: 0 20px;
  }
  .clickLeftEvent {
    padding: 20px 0;
    background-color: #fff;
  }
}
</style>
