<template>
  <div class="sync-bill">
    <div>确定立即同步账单吗?</div>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

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
.sync-bill {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
