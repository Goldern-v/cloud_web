<template>
  <div class="delete">
    <div>确定要对以下1台云服务器进行删除操作吗?</div>

    <ideal-table-list
      :table-data="originalData"
      :table-headers="originalHeader"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.id }}</div>
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>
      <template #spec>
        <el-table-column label="规格">
          <template #default="props">
            <div>
              {{ props.row.flavor.vcpus }}核｜{{ props.row.flavor.ram }}G
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm()">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm()">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, BillingEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import store from '@/store'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import {
  deleteCloudHost,
  submitCloudHostOrder,
  recycleCloudHost
} from '@/api/java/compute'

interface DeleteProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DeleteProps>(), {
  rowData: () => ({})
})
const { t } = useI18n()
// 原有规格数据
const originalData = ref<any[]>([])
onMounted(() => {
  originalData.value = [props.rowData]
})
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '镜像', prop: 'image.osVersion' },
  { label: '规格', prop: 'spec', useSlot: true },
  { label: '创建时间', prop: 'createTime.date' }
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
  recycleCloudHost({ uuid: props.rowData.uuid }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      emit(EventEnum.success)
      ElMessage.success('删除进回收站成功')
    } else {
      ElMessage.error(data.msg || '删除失败')
    }
  })
}
const submitOrder = () => {
  const params = {
    billType: props?.rowData?.billingMode ? BillingEnum.PACKAGE : BillingEnum.ON_DEMAND,
    resourceId: props?.rowData?.billResourceId,
    orderType: 'UNSUBSCRIBE',
    vdcId: props?.rowData?.vdcId
  }
  submitCloudHostOrder(params).then((res: any) => {
    const { data, code, eventFlowId } = res
    if (code === 200) {
      if (eventFlowId.length) {
        // 保存事件流id
        eventFlowId.forEach((item: string) => {
          store.resourceStore.eventFlow.push({ eventFlowId: item })
        })
      }
      ElMessage.success('删除成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error(data.msg || '删除失败')
    }
  })
}
</script>

<style scoped lang="scss">
.delete {
  width: 100%;
  .delete__tip {
    background-color: #fefbed;
    padding: 20px;
    align-items: center;
    margin-top: 10px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
