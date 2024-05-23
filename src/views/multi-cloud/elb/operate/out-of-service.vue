<template>
  <div class="out-of-service">
    <div>
      <div class="flex-row">
        <img src="@/assets/warning.png" style="width: 25px" alt="" />
        <span class="warning_title">确定停用该负载均衡?</span>
      </div>
      <div class="flex-row custom-warning-box">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <ul class="ideal-large-margin-left">
          <li>该负裂均衡器将停止接收和转发流量直到您重新启用</li>
          <li>
            <span class="custom-danger-text"
              >负载均微器和未程放的弹性从网IP会城续计费。</span
            >
          </li>
        </ul>
      </div>
      <ideal-table-list
        :table-data="tableData"
        :table-headers="tableHeader"
        :show-pagination="false"
      >
        <template #serviceAddress>
          <el-table-column label="服务地址">
            <template #default="props">
              <p>
                {{ props.row.privateIp
                }}<span class="ideal-tip-text ideal-default-margin-left">(IPv4私有地址)</span>
              </p>
              <p>
                {{ props.row.publicIp
                }}<span class="ideal-tip-text ideal-default-margin-left">(IPv4公网地址)</span>
              </p>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

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

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.rowData]
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '状态', prop: 'statusText' },
  { label: '服务地址', prop: 'serviceAddress', useSlot: true }
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
  showLoading('停用中...')
  eipUnbindInstance(params)
    .then((res: any) => {
      const { msg, code, status } = res
      if (code === 200 && status) {
        ElMessage.success('停用成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '停用失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.out-of-service {
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
  .custom-warning-box {
    background-color: var(--custom-information-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 10px 20px;
    margin-top: 20px;
    align-items: baseline;
  }
  .custom-danger-text {
    color: $errorColor;
  }
}
</style>
