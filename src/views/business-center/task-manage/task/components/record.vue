<template>
  <div class="ideal-table-list__container record">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '订单ID', prop: 'orderId' },
  { label: '创建人', prop: 'creator' },
  { label: '创建时间', prop: 'createTime' },
  { label: '记录', prop: 'record' }
]
state.dataList = [
  {
    orderId: '20230725000001',
    creator: '系统管理员',
    createTime: '2023-07-25 16:14:34',
    record: '订单转工单成功'
  },
  {
    orderId: '20230725000012',
    creator: '系统管理员',
    createTime: '2023-07-25 16:14:34',
    record: '订单转工单成功'
  },
  {
    orderId: '20230725000027',
    creator: '系统管理员',
    createTime: '2023-07-25 16:14:34',
    record: '订单转工单成功'
  },
  {
    orderId: '20230725000037',
    creator: '系统管理员',
    createTime: '2023-07-25 16:14:34',
    record: '订单转工单成功'
  },
  {
    orderId: '20230725000067',
    creator: '系统管理员',
    createTime: '2023-07-25 16:14:34',
    record: '订单转工单成功'
  },
  {
    orderId: '20230728000002',
    creator: '系统管理员',
    createTime: '2023-07-25 16:14:34',
    record: '订单转工单成功'
  }
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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.record {
  width: 100%;
  padding: 20px;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
