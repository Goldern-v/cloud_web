<template>
  <div class="ideal-large-margin subnet-detail">
    <div class="nic-detail_header">
      <div class="flex-row nic-detail_back">
        <svg-icon icon="left-arrow" @click="goBack"></svg-icon>
        <el-divider direction="vertical" />
        <span>{{ detailInfo.fixedIp }}</span>
      </div>
      <el-tabs
        v-model="activeName"
        class="subnet-detail__tabs"
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
    </div>

    <component
      :is="tabs[activeName]"
      v-bind="currentProps"
      :detail-info="detailInfo"
      class="subnet-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './basic-info.vue'
import assistList from './assist-list.vue'
import associateSafeGroup from './associate-safe-group.vue'
import type { TabsPaneContext } from 'element-plus'
import { queryNetCardDetail } from '@/api/java/network'

// 标签页组件
const tabs: any = { basicInfo, assistList, associateSafeGroup }

const route = useRoute()
const routeData = JSON.parse(route.query.data as any)

interface TabProps {
  label?: string
  name?: string
}
const tabControllers = ref<TabProps[]>([])
const activeName = ref('')
onMounted(() => {
  if (routeData.type === 'MAIN_CARD') {
    tabControllers.value = tabOptions
  } else {
    tabControllers.value = tabOptions.filter(
      (item: any) => item.name !== 'assistList'
    )
  }
  activeName.value = routeData.tab ? routeData.tab : 'basicInfo'
  queryNicInfo()
})
// tabs标签页
const tabOptions: TabProps[] = [
  { label: '基本信息', name: 'basicInfo' },
  { label: '辅助弹性网卡', name: 'assistList' },
  { label: '关联安全组', name: 'associateSafeGroup' }
]

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'basicInfo') {
    currentProps.value = { uuid: 'test' }
  }
})
//公共入参
const commonParams = () => {
  const params = {
    resourcePoolId: routeData.resourcePoolId,
    regionId: routeData.regionId,
    projectId: routeData.projectId
  }
  return params
}
// 详情
const detailInfo: any = ref({})
//弹性网卡详细信息
const queryNicInfo = () => {
  queryNetCardDetail({ id: routeData.id, ...commonParams() }).then(
    (res: any) => {
      const { data, code } = res
      if (code === 200) {
        detailInfo.value = data
      } else {
        detailInfo.value = {}
      }
    }
  )
}

const router = useRouter()
const goBack = () => {
  router.push({
    path: '/multi-cloud/elastic-net-card/list',
    query: {
      type: routeData.type
    }
  })
}
</script>

<style scoped lang="scss">
.subnet-detail {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .subnet-detail__tabs {
    background-color: white;
  }
  .subnet-detail__component {
    margin-top: 20px;
  }
  .nic-detail_header {
    background-color: #fff;
    padding: 0 20px;
    .nic-detail_back {
      align-items: center;
      height: 40px;
    }
  }
}
</style>
