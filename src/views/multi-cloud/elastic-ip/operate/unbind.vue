<template>
  <div class="unbind">
    <div class="flex-row">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">{{ description }}</span>
    </div>
    <div class="flex-row warning_desc">
      按流量计费的EIP，在与实例解绑时，会按时长收取IP保有费，更多计费信息请参考
      <el-text type="primary">计费说明</el-text>
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
import { eipUnbindInstance } from '@/api/java/network'

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

const showUnbind = computed(() => props.dialogType === OperateEventEnum.unbind) // 单个解绑

const description = ref('')

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = showUnbind.value ? [props.rowData] : props.multipleSelection
  tableData.value.forEach((item: any) => {
    item.bindInstanceName = item.bindInstanceName || '--'
    item.bindInstanceType = item.bindInstanceType || '--'
  })
  description.value = showUnbind.value
    ? '确定要解绑该弹性Ip？'
    : '确定要对以下弹性公网Ip进行解绑操作？'
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '已绑定实例', prop: 'bindInstanceName' },
  { label: '已绑定实例类型', prop: 'bindInstanceType' }
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
