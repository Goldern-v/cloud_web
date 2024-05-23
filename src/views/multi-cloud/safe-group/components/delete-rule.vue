<template>
  <div class="unbind">
    <div class="flex-row">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">确定要删除以下入方向规则吗?</span>
    </div>
    <div class="flex-row warning_desc">
      删除安全组规则会影响该安全组作用的实例。
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
import { safeGroupRuleDelete } from '@/api/java/network'

const { t } = useI18n()
interface PowerOnProps {
  dialogType: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({}),
  multipleSelection: () => []
})

const showDelete = computed(() => props.dialogType === OperateEventEnum.delete) // 单个解绑

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = showDelete.value ? [props.rowData] : props.multipleSelection
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '协议端口', prop: 'protocolPort' },
  { label: '源地址', prop: 'sourceAddress' }
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
    projectId: props.rowData.projectId,
    regionId: props.rowData.regionId
  }
  return params
}

const submitForm = () => {
  const params = {
    id: props.rowData.id,
    ...commonParams()
  }
  showLoading('删除安全组规则中...')
  safeGroupRuleDelete(params)
    .then((res: any) => {
      const { msg, code, status } = res
      if (code === 200 && status) {
        ElMessage.success('删除成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '删除失败')
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
}
</style>
