<template>
  <div class="upgrade">
    <div>清除后您无法再从云上获取该私钥，请谨慎操作。</div>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-multiple="true"
    />
    
    <div class="flex-row footer-button">
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
// 列表
const dataList = ref<any[]>([
  { name: 'KeyPair-0934', fingerprint: '1ls4s45434ad4we'}
])

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '密钥对名称', prop: 'name' },
  { label: '指纹', prop: 'fingerprint' }
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
.upgrade {
  width: 100%;
  .upgrade-tip {
    background-color: $warning1-light;
    padding: 10px;
    margin-bottom: 10px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
    margin-top: 10px;
  }
}
</style>