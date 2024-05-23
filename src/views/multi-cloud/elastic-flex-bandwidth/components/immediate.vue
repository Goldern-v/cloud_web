<template>
  <div class="immediate">
    <div class="flex-row">
      <svg-icon icon="info-warning" class="ideal-svg-margin-right" class-name="immediate-warning"/>
      <div>确定立即执行伸缩带宽策略吗？</div>
    </div>

    <ideal-table-list
      :table-data="dataArray"
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
import type { IdealTableColumnHeaders } from '@/types'
import { isEmpty } from '@/utils/is'
import { EventEnum } from '@/utils/enum'

interface ImmediateProps {
  rowData?: any
}
const props = withDefaults(defineProps<ImmediateProps>(),{
  rowData: () => ({})
})

const { t } = useI18n()

const dataArray = ref([])

onMounted(() => {
  if (!isEmpty(props.rowData)) {
    dataArray.value = [props.rowData]
  }
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' },
  { label: '策略类型', prop: 'type' }
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
.immediate {
  width: 100%;
  :deep(.immediate-warning) {
    color: $warning4-light;
    width: 24px;
    height: 24px;
  }
}
</style>
