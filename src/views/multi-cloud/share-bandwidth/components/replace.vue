<template>
  <div class="replace">
    <div>您已选择1个共享带宽，以下一个可以转包年/包月</div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
    />

    <div class="flex-row replace-button">
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
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface ReplaceProps {
  selectData?: any[]
}
const props = withDefaults(defineProps<ReplaceProps>(), {
  selectData: () => ([])
})
onMounted(() => {
  tableArray.value = props.selectData
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '共享带宽名称', prop: 'name' },
  { label: '计费方式', prop: 'billingModeDes' },
  { label: '带宽(Mbit/s)', prop: 'size' }
]
const tableArray = ref<any[]>([])

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
.replace {
  width: 100%;
  .replace-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
}
</style>