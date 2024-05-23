<template>
  <div class="delete">
    <div class="delete-tip">
      确认要删除以下快照吗？删除操作无法恢复，请谨慎操作。
    </div>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    ></ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="clickCancel">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSave">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()

const dataList = [
  { name: 'ecm-01', status: '成功', createTime: '2024-01-20 19:02:10', size: '40' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '快照名称', prop: 'name' },
  { label: '快照状态', prop: 'status' },
  { label: '创建时间', prop: 'createTime' },
  { label: '容量(GB)', prop: 'size' }
]
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const clickSave = () => {
  emit(EventEnum.success)
}
const clickCancel = () => {
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.delete {
  width: 100%;
  .delete-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
  }
}
</style>
