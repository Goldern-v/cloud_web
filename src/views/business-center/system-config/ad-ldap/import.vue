<template>
  <div class="import">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-multiple="true"
      :show-pagination="false"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle">
    </ideal-table-list>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } = useCrud(state)
state.dataList = [
  { account: 'f0d0adb1-9836-6162-0928', phone: '13300001234', exit: '是', email: '111@163.com' },
  { account: 'f0d0adb1-9836-6162-0928', phone: '15500001234', exit: '否', email: '556@qq.com' },
  { account: 'f0d0adb1-9836-6162-0928', phone: '16600004321', exit: '是', email: '9843@189.cn' }
]
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '账户', prop: 'account' },
  { label: '手机', prop: 'phone' },
  { label: '邮箱', prop: 'email' },
  { label: '是否存在', prop: 'exit' }
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
.import {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    background-color: white;
    padding: 10px 20px 0;
  }
}
</style>