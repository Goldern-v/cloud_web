<template>
  <div class="detail">
    <div
      class="flex-row"
      style="justify-content: space-between; padding: 20px 20px 0"
    >
      <div>{{ detailInfo.name }}</div>
    </div>

    <div class="detail-title">基本信息</div>

    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
      label-position="left"
      @edit-info="editInfo"
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
import shareLine from './components/share-line.vue'
import {
  cloudResourceDetail,
  cloudResourceUpdate
} from '@/api/java/operate-center'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { portStatusFormat } from '../common'

const labelArray = ref([
  { label: '物理专线接口', prop: 'physicalConnectionId', isCopy: true },
  { label: '名称', prop: 'name', isEdit: true },
  { label: '接入点', prop: 'accessPointId' },
  { label: '物理专线带宽', prop: 'bandwidthText' },
  { label: '端口类型', prop: 'portType' },
  { label: '物理专线运营商', prop: 'lineOperator' },
  { label: '端口状态', prop: 'statusText' },
  { label: '客户IDC位置', prop: 'peerLocation' },
  { label: '创建时间', prop: 'creationTime' },
  { label: '专线类型', prop: 'productType' },
  { label: '资源组', prop: 'resourceGroupId', isCopy: true }
])

const activeName = ref('shareLine')
// 标签页组件
const tabs: any = { shareLine }
// tabs标签页
const tabControllers = ref([{ label: '共享专线', name: 'shareLine' }])
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(() => {
  queryDetailData()
})
const detailInfo = ref({
  name: '',
  accessPointId: '',
  bandwidthText: '',
  portType: '',
  lineOperator: '',
  statusText: '',
  peerLocation: '',
  creationTime: '',
  resourceGroupId: ''
})
const route = useRoute()
// 订单详情获取
const queryDetailData = () => {
  const params = {
    cloudType: 'ALI_CLOUD',
    interconnectId: route.query.id
  }
  cloudResourceDetail(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        detailInfo.value =
          data.aliCloudConnectionOutDto.aliConnectionDtoList.map(
            (item: any) => {
              item.bandwidthText = item.bandwidth ? item.bandwidth + 'M' : ''
              item.statusText = item.status ? portStatusFormat[item.status] : ''
              return item
            }
          )[0]
      }
    })
    .catch(_ => {})
}
const editInfo = (val: any, config: any) => {
  const params = {
    cloudType: 'ALI_CLOUD',
    physicalConnectionId: val.physicalConnectionId,
    bandwidthSize: val.bandwidth,
    vlanId: val.vlanId,
    regionCode: val.regionCode,
    physicalConnectionName: val.name
  }
  showLoading('更新中...')
  cloudResourceUpdate(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('请求成功')
        config.showEdit = false
        queryDetailData()
      } else {
        ElMessage.error('请求失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
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
