<template>
  <div class="unbind">
    <div class="flex-row">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">确定要解绑该弹性Ip？</span>
    </div>

    <div class="flex-row custom-warning-box ideal-large-margin-top">
      <svg-icon icon="info-warning" color="var(--el-color-primary)"></svg-icon>
      <span
        >解绑弹性公网IP后将解除该辅助弹性网卡与弹性公网IP的关联，按需的弹性公网IP如不释放，将继续计费。</span
      >
    </div>

    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeader"
      :show-pagination="false"
    >
      <template #eip>
        <el-table-column label="弹性公网IP">
          <template #default="props">
            <div class="ideal-theme-text">
              {{ props.row.eip?.ipAddress }}
            </div>

            <div>
              {{ props.row.eip?.name }}
            </div>

            <div>
              {{ props.row.eip?.billType === 'PACKAGE' ? '包年包月' : '按需' }}
            </div>
          </template>
        </el-table-column>
      </template>
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
import { eipUnbindInstance } from '@/api/java/network'

const { t } = useI18n()
interface PowerOnProps {
  rowData?: any // 行数据
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({}),
  multipleSelection: () => []
})

const description = ref('')

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.rowData]
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'fixedIp' },
  { label: '绑定的弹性公网IP', prop: 'eip', useSlot: true }
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
    uuid: props.rowData.eip?.uuid,
    ...commonParams()
  }
  showLoading('解绑中...')
  eipUnbindInstance(params)
    .then((res: any) => {
      const { msg, code, status } = res
      if (code === 200 && status) {
        ElMessage.success('解绑成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '解绑失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.unbind {
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
  .warning_desc {
    margin: 10px 0;
  }
  .el-text {
    cursor: pointer;
  }
  .custom-warning-box {
    background-color: var(--custom-information-bg-color);
    padding: 10px 20px;
    align-items: center;
  }
}
</style>
