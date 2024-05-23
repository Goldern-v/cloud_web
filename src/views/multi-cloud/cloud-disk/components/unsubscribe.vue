<template>
  <div class="unsubscribe">
    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #info>
        <el-table-column label="实例信息" show-overflow-tooltip>
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.uuid }}</div>
            <div>产品类型：云硬盘</div>
            <div></div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { cloudDiskUnsubscribe } from '@/api/java/store'
import { queryInquiry } from '@/api/java/public'
import store from '@/store'
import { approvalProcess } from '@/utils/tool'

interface UnsubscribeProps {
  rowData?: any
}

const props = withDefaults(defineProps<UnsubscribeProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const tableArray = ref<any[]>([])
onMounted(() => {
  getInquiry()
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例信息', prop: 'info', useSlot: true },
  { label: '退订类型', prop: 'type', useSlot: true },
  { label: '支付信息(¥)', prop: 'finalPrices' },
  { label: '扣减金额(¥)', prop: 'deduction' },
  { label: '实际退款(¥)', prop: 'payPrices' }
]

// 询价
const getInquiry = () => {
  let params: { [key: string]: any } = {
    cloudPlatformId: props.rowData?.cloudResourcePool?.cloudPlatform?.id, // 云平台类型id
    resourceType: 'EBS', // 云资源类型
    billType: props.rowData?.billType, // 计费模式
    itemsList: [
      {
        code: 'basic_price',
        specs: '1'
      },
      {
        code: props.rowData?.volumeType,
        specs: props.rowData?.size // 系统盘大小
      }
    ], // 计费项列表
    resourceId: props.rowData?.billResourceId,
    orderType: 'UNSUBSCRIBE' // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
  }

  queryInquiry(params).then((res: any) => {
    const { code, data } = res
    let finalPrices = 0 // 支付
    let payPrices = 0 // 实际退款
    let deduction = 0 // 扣减
    if (code === 200) {
      finalPrices = Math.abs(data.finalPrices)
      payPrices = Math.abs(data.payPrices)
      deduction = Math.abs(data.finalPrices + data.payPrices)
    } else {
      finalPrices = 0
      payPrices = 0
      deduction = 0
    }
    const dic = {
      ...props.rowData,
      finalPrices, // 支付
      payPrices, // 实际退款
      deduction // 扣减
    }
    tableArray.value = [dic]
  })
}

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  const params = {
    resourceIdList: [{ resourceUuid: props.rowData.uuid, mainResource: true }],
    unsubscribeType: 1,
    unsubscribeReasonType: 5,
    resourceType: 'EBS',
    type: 'UNSUBSCRIBE',
    resourcePoolId: props.rowData.resourcePoolId,
    // poolTypeUuid: rowData.value.
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId,
    vdcId: props.rowData.vdcId
    // cloudPlatformId: rowData.value.
  }
  showLoading('退订中...')
  cloudDiskUnsubscribe(params)
    .then((res: any) => {
      const { code, data } = res
      const orderId: any = data
      if (code === 200) {
        approvalProcess('EBSTD', store.userStore.user.vdcId, orderId).then(
          (res: any) => {
            if (res.code === 200) {
              emit(EventEnum.success)
            }
          }
        )
      } else {
        ElMessage.error('退订失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.unsubscribe {
  width: 100%;
}
</style>
