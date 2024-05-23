<template>
  <div>
    <div>即将删除以下个域名</div>
    <div class="ideal-tip-text">
      删除域名会同时删除域名下的所有记录集。确定要删除该域名吗？
    </div>

    <ideal-table-list
      :table-data="tableArray"
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
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface deleteProps {
  tableArray?: any[]
}
const props = withDefaults(defineProps<deleteProps>(), {
  tableArray: () => []
})

const tableHeader: IdealTableColumnHeaders[] = [
  { label: '域名', prop: 'name' },
  { label: '状态', prop: 'statusText' },
  { label: '记录集个数', prop: 'recordSetCount' }
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
const submitForm = () => {}
</script>

<style scoped lang="scss"></style>
