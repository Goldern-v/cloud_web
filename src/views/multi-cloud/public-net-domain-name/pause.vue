<template>
  <div class="pause">
    <div class="flex-row">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">暂停公网域名</span>
    </div>
    <div class="warning_desc">
      <p>确定要暂停该公网域名吗？</p>
      <p>暂停公网域名会停止该域名下所有记录集解析，请您谨慎操作。</p>
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

const { t } = useI18n()
interface PowerOnProps {
  dialogType?: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({})
})

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.rowData]
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '域名', prop: 'name' },
  { label: '状态', prop: 'statusText' },
  { label: '记录集个数', prop: 'recordSetCount' }
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

//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
  return params
}

const submitForm = () => {
  const params = {
    uuid: props.rowData.uuid,
    ...commonParams()
  }
  showLoading('解绑中...')
}
</script>

<style scoped lang="scss">
.pause {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
  .warning_title {
    margin-left: 10px;
    font-weight: bolder;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
  .el-text {
    cursor: pointer;
  }
  .warning_desc {
    margin-top: 10px;
    p {
      line-height: 20px;
    }
  }
}
</style>
