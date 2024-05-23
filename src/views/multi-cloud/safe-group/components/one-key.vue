<template>
  <div class="one-key">
    <div class="flex-row one-key__tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div>
        <div>一键放通功能仅判断是否已添加相应的安全组规则，请确保当前安全组下没有优先级更高的拒绝策略的安全组规则。</div>
      </div>
    </div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false" />

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
interface OneKeyProp {
  tableArray?: any[]
}
withDefaults(defineProps<OneKeyProp>(), {
  tableArray: () => ([])
})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '优先级', prop: 'priority' },
  { label: '策略', prop: 'policy' },
  { label: '类型', prop: 'type' },
  { label: '端口协议', prop: 'port' },
  { label: '源地址', prop: 'address' },
  { label: '描述', prop: 'description' }
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
.one-key {
  width: 100%;
  .one-key__tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
