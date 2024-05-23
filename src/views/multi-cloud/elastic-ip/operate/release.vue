<template>
  <div class="release-container">
    <div class="flex-row" style="align-items: flex-end">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">确定要对以下弹性公网IP进行释放操作?</span>
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
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import store from '@/store'
import { deleteOnDemandEip } from '@/api/java/network'

interface releaseProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<releaseProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.rowData]
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '带宽名称', prop: 'bandwidth.name' },
  { label: '带宽大小(Mbit/s)', prop: 'bandwidth.size' }
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

const commonParams = () => {
  const params = {
    resourcePoolId: props?.rowData?.resourcePoolId,
    regionId: props?.rowData?.regionId,
    projectId: props?.rowData?.projectId
  }
  return params
}
const submitForm = () => {
  showLoading('释放中...')
  deleteOnDemandEip({
    uuid: props?.rowData?.uuid,
    vdcId: props?.rowData?.vdcId,
    ...commonParams()
  })
    .then((res: any) => {
      const { msg, code, status, data } = res
      if (code === 200 && status) {
        ElMessage.success(data || '释放成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '释放失败')
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
