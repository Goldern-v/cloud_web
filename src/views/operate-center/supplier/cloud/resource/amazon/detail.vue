<template>
  <div class="detail">
    <div
      class="flex-row"
      style="justify-content: space-between; padding: 20px 20px 0"
    >
      <div>{{ detailInfo.interconnectName }}</div>

      <ideal-button-events
        style="width: 60%"
        :right-btns="rightButtons"
        @clickRightEvent="clickRightEvent"
      />
    </div>

    <div class="detail-title">常规配置</div>

    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
      label-position="left"
    >
    </ideal-detail-info>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) of tabControllers"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]"></component>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import trusteeship from './components/trusteeship.vue'
import { awsStatusFormat } from '../common'
import type { IdealButtonEventProp } from '@/types'
import { cloudResourceDetail } from '@/api/java/operate-center'
// 列表左侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { title: '下载LOA', prop: 'download' },
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
])
const clickRightEvent = (value: string | number | object) => {
  if (value === 'download') {
  }
}

const labelArray = ref([
  { label: '互连ID', prop: 'interconnectId' },
  { label: '状态', prop: 'statusText' },
  { label: '位置', prop: 'location' },
  { label: '巨型帧支持', prop: 'jumboFrameCapable' },
  { label: '互连名称', prop: 'interconnectName' },
  { label: '端口速度', prop: 'speed' },
  { label: 'AWS逻辑设备', prop: 'awsLogicalDeviceId' },
  { label: 'AWS账户', prop: 'ownerAccount' },
  { label: '区域', prop: 'region' },
  { label: 'LOA签发', prop: 'loa' }
])
const detailInfo = ref({
  interconnectId: '',
  status: '',
  location: '',
  jumboFrameCapable: '',
  interconnectName: '',
  speed: '',
  equipment: '',
  account: '',
  region: '',
  loa: '',
  statusText: ''
})

const activeName = ref('trusteeship')
// 标签页组件
const tabs: any = { trusteeship }
// tabs标签页
const tabControllers = ref([{ label: '托管连接', name: 'trusteeship' }])
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(() => {
  queryDetailData()
})
const route = useRoute()
// 订单详情获取
const queryDetailData = () => {
  const params = {
    cloudType: 'AWS',
    interconnectId: route.query.id
  }
  cloudResourceDetail(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        detailInfo.value =
          data.awsCloudConnectionOutDto.awsConnectionDtoList.map(
            (item: any) => {
              item.statusText = item.interconnectState
                ? awsStatusFormat[item.interconnectState]
                : ''
              return item
            }
          )[0]
      }
    })
    .catch(_ => {})
}
</script>

<style scoped lang="scss">
.detail {
  background-color: white;
  margin: $idealMargin;
  .detail-title {
    font-size: $mediumFontSize;
    font-weight: 500;
    padding: 10px $idealPadding;
  }
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
}
</style>
