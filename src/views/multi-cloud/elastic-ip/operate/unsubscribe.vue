<template>
  <div class="release-container">
    <div class="flex-row" style="align-items: flex-end">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">确定要对以下弹性公网IP进行退订操作?</span>
    </div>
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeader"
      :show-pagination="false"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, resourceTypeEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { unsubscribeEip } from '@/api/java/network'
import store from '@/store'
import { approvalProcess } from '@/utils/tool'

interface PowerOnProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.rowData]
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: 'IP名称', prop: 'name' },
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '状态', prop: 'statusText' },
  { label: '绑定实例类型', prop: 'bindInstanceType' },
  { label: '绑定实例名称', prop: 'bindInstanceName' },
  { label: '带宽大小(Mbit/s)', prop: 'bandwidth.size' },
  { label: '创建时间', prop: 'createTime.date' },
  { label: '过期时间', prop: 'createTime.date' }
]

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  showLoading('退订中...')
  const params: any = {
    resourceIdList: [{ resourceUuid: props.rowData.uuid, mainResource: true }],
    unsubscribeType: 1,
    resourceType: resourceTypeEnum.EIP,
    type: 'UNSUBSCRIBE', // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId,
    billCycle: props.rowData.billCycle,
    billCycleNum: props.rowData.billCycleNum,
    billResourceId: props.rowData.billResourceId, //计费项id
    instanceResourceId: props.rowData.id
  }
  unsubscribeEip(params)
    .then((res: any) => {
      const { msg, code, status, data } = res
      const orderId: any = data
      if (code === 200 && status) {
        // 根据vdc判断是否走审批，传创建类型，vdcId和订单返回的订单号
        approvalProcess('EIPTD', store.userStore.user.vdcId, orderId).then(
          (res: any) => {
            if (res.code === 200) {
              emit(EventEnum.success)
            }
          }
        )
      } else {
        ElMessage.error(msg || '退订失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.release-container {
  width: 100%;
  .warning_title {
    margin-left: 10px;
    font-weight: bolder;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
  .warning_desc {
    margin: 10px 0;
  }
}
</style>
