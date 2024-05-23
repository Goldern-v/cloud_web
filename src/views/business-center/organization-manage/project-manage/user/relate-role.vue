<template>
  <div class="relate-role">
    <ideal-table-list
      :is-multiple="true"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>
    <div class="flex-row ideal-submit-button">
      <el-button @click="clickCancel">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSuccess">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '角色', prop: 'role' },
  { label: '描述', prop: 'desc' }
]
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  dataList: [
    {
      id: 1,
      role: '角色1',
      desc: '1234'
    }
  ]
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
// 关闭弹框
const clickCancel = () => {
  emit(EventEnum.cancel)
}
// 成功修改s
const clickSuccess = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.relate-role {
  width: 100%;
}
</style>
