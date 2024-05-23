<template>
  <div class="elastic-ip">
    <div class="flex-row elastic-ip-button-box">
      <el-button type="primary" @click="clickBind">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
        <span>绑定弹性IP</span>
      </el-button>

      <el-button link type="primary" @click="clickGoToEip">查看弹性公网IP</el-button>
    </div>

    <el-collapse accordion>
      <el-collapse-item v-for="(item,index) of bindList" :key="index" :name="index">
        <template #title>
          <div class="flex-row collapse-title" @click.stop>
            <span style="width: 40%;text-align: left;">{{item.ipAddress}} | {{ item.fixedIp }}</span>

            <ideal-button-events
              style="width: 60%"
              :right-btns="rightButtons"
              :right-max-buttons="5"
              @clickRightEvent="clickRightEvent($event, item)"
            >
            </ideal-button-events>
          </div>
        </template>

        <ideal-detail-info
          :label-array="diskArray"
          :detail-info="item"
          label-position="left"
        >
          <template #status>
            <ideal-status-icon
              v-if="item.status"
              :status-icon="item.statusIcon"
              :status-text="item.statusText"
            />
          </template>
        </ideal-detail-info>
      </el-collapse-item>
    </el-collapse>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      :detail="detailInfo"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import type { IdealButtonEventProp } from '@/types'
import { OperateEventEnum, BillingEnum } from '@/utils/enum'
import { cloudHostEipDetail } from '@/api/java/compute'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'

interface DetailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  detailInfo: () => ({})
})

const bindList = ref<any[]>([])

onMounted(() => {
  getEipDetail()
})
const eipTypeDic: { [key: string]: string} = {
  '5_bgp': '全动态BGP',
  '5_sbgp': '静态BGP'
}
const getEipDetail = () => {
  const params = {
    instanceUuid: props.detailInfo.uuid
  }
  cloudHostEipDetail(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      bindList.value = data.map((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
        item.billingMode = item.billType === BillingEnum.ON_DEMAND ? '按需':'包年包月'
        item.eipTypeText = item?.eipType ? eipTypeDic[item.eipType] : '--'
        item.createDate = item.createTime.date
        handleInfo(item.billType === BillingEnum.ON_DEMAND)
        return item
      })
    } else {
      bindList.value = []
    }
  }).catch(_ => {
    bindList.value = []
  })
}
const rowData = ref()
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  { title: '解绑', prop: 'unbind', text: true, type: 'primary' }
]
const clickRightEvent = (value: string | number | object, row: any) => {
  rowData.value = row
  if (value === 'unbind') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.unbind
  }
}
// 云硬盘信息
const diskArray = ref<any[]>([
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '类型', prop: 'eipTypeText' },
  { label: 'ID', prop: 'eipUuid' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '已绑定私有IP', prop: 'fixedIp' },
  { label: '带宽名称', prop: 'bandwidthName' },
  { label: '带宽大小', prop: 'bandwidthSize' },
  { label: '带宽ID', prop: 'bandwidthId' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '创建时间', prop: 'createDate' }
])
const handleInfo = (isOnDemand: boolean) => {
  if (!isOnDemand) {
    diskArray.value.push({ label: '到期时间', prop: 'removedTime' })
  }
}

const router = useRouter()
const clickGoToEip = () => {
  router.push({ path: '/multi-cloud/elastic-ip/list'})
}
const clickBind = () => {
  dialogType.value = OperateEventEnum.bind
  showDialog.value = true
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getEipDetail()
}
</script>

<style scoped lang="scss">
.elastic-ip {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: white;
  .collapse-title {
    flex: 1;
    order: 1;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: var(--el-color-primary-light-9);
    border-top: none;
    border-bottom: none;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: $circleRadiusSize;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
  .elastic-ip-button-box {
    align-items: center;
    justify-content: flex-start;
    margin-top: 20px;
  }
  // 修改描述列表
  :deep(.el-descriptions__label:not(.is-bordered-label) ) {
    color: #8B8B8B;
    font-size: 14px;
  }
  :deep(.el-descriptions__content:not(.is-bordered-label)) {
    color: #000;
    font-size: 14px;
  }
}
</style>
