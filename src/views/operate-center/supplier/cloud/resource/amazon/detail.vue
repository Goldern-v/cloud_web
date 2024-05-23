<template>
  <div class="detail">
    <div class="flex-row" style="justify-content: space-between;padding: 20px 20px 0;">
      <div>pc-kljadfa</div>
      
      <ideal-button-events
        style="width: 60%;"
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
      <template #status>
        <ideal-status-icon
          :status-icon="detailInfo.statusIcon"
          :status-text="detailInfo.status"
        />
      </template>
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
import type {
  IdealButtonEventProp
} from '@/types'

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
  { label: '互连ID', prop: 'id' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '位置', prop: 'location' },
  { label: '巨型帧支持', prop: 'frame' },
  { label: '互连名称', prop: 'name' },
  { label: '端口速度', prop: 'speed' },
  { label: 'AWS逻辑设备', prop: 'equipment' },
  { label: 'AWS账户', prop: 'account' },
  { label: '区域', prop: 'region' },
  { label: 'LOA签发', prop: 'loa' }
])
const detailInfo = ref({
  id: 'dxs-kjkal23',
  statusIcon: 'status-success',
  status: '可用',
  location: 'Equkink Hk1,Tusen Wan, N.T.,Hong Kong',
  frame: 'true',
  name: 'collaboration-HKG-Zenlayer',
  speed: '10Gbps',
  equipment: 'EQHK1-3jk08amkj',
  account: '-',
  region: 'ap-east-1',
  loa: '2024-04-01'
})

const activeName = ref('trusteeship')
// 标签页组件
const tabs: any = { trusteeship }
// tabs标签页
const tabControllers = ref([{ label: '托管连接', name: 'trusteeship' }])
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
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
