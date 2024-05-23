<template>
  <div class="close">
    <div>关闭网络ACL规则会导致该网络ACL规则不生效。</div>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()

const dataList = ref<any[]>([])

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '策略', prop: 'policy' },
  { label: '协议', prop: 'protocol' },
  { label: '目的地址', prop: 'goalAddress' }
]

// 方法
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
.close {
  width: 100%;
}
</style>
