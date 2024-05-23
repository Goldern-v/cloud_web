<template>
  <div class="detail">
    <div class="flex-row" style="justify-content: space-between;padding: 20px 20px 0;">
      <div>pc-kljadfa</div>
      <el-button type="primary">编辑</el-button>
    </div>

    <div class="detail-title">基本信息</div>

    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
      label-position="left"
    >
      <template #allocStatus>
        <ideal-status-icon
          :status-icon="detailInfo.statusIcon"
          :status-text="detailInfo.allocStatus"
        />
      </template>

      <template #linkStatus>
        <ideal-status-icon
          :status-icon="detailInfo.statusIcon"
          :status-text="detailInfo.linkStatus"
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
import shareLine from './components/share-line.vue'

const labelArray = ref([
  { label: '物理专线接口', prop: 'physicalInterface', isCopy: true },
  { label: '名称', prop: 'name', isEdit: true },
  { label: '接入点', prop: 'accessPoint' },
  { label: '物理专线带宽', prop: 'physicalBandwidth' },
  { label: '端口类型', prop: 'portType' },
  { label: '物理专线运营商', prop: 'physicalOperator' },
  { label: '端口分配状态', prop: 'allocStatus', useSlot: true },
  { label: '端口连接状态', prop: 'linkStatus', useSlot: true },
  { label: '客户IDC位置', prop: 'location' },
  { label: '创建时间', prop: 'createTime' },
  { label: '专线类型', prop: 'specialType' },
  { label: '标签', prop: 'tag', isEdit: true },
  { label: '资源组', prop: 'resourceGroup', isCopy: true },
  { label: '端口高级能力', prop: 'portAdvanced' }
])
const detailInfo = ref({
  physicalInterface: 'pc-9s29da34',
  name: 'TO_LK_UK_THE_234',
  accessPoint: '伦敦-D',
  physicalBandwidth: '1000Mbps',
  portType: '万兆单模光口',
  physicalOperator: '境外其他',
  statusIcon: 'status-success',
  allocStatus: '已开通',
  linkStatus: '可用',
  location: '',
  createTime: '2024-04-23 12:09:20',
  specialType: '独享专线',
  tag: '',
  resourceGroup: 'rg-adcasdf',
  portAdvanced: 'VBR限速'
})

const activeName = ref('shareLine')
// 标签页组件
const tabs: any = { shareLine }
// tabs标签页
const tabControllers = ref([{ label: '共享专线', name: 'shareLine' }])
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
