<template>
  <div class="unbind-elb">
    <div class="flex-row">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">确定要解绑该弹性Ip?</span>
    </div>
    <div class="flex-row warning_desc">
      解绑弹性公网IP后，此弹性负截均衡器将更改为私网类型，无法再进行公网流量转发，请道慎操作。
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
import store from '@/store'

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
  { label: 'IPv4公网地址', prop: 'ipAddress' },
  { label: '状态', prop: 'status' },
  { label: '带宽大小', prop: 'bandwidthSize' }
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

const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.region,
    regionName: regionInfo.value?.name,
    projectId: props.rowData.projectId,
    vdcId: store.userStore.user.vdcId,
    vdcCode: store.userStore.user.vdcCode
  }
  return params
}

const submitForm = () => {
  const params = {
    eipUuid: props.rowData.uuid,
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
.unbind-elb {
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
}
</style>
