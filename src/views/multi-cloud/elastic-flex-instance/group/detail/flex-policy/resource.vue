<template>
  <div class="resource">
    <ideal-table-list
      :table-data="dataArray"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.statusDes"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { isEmpty } from '@/utils/is'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface ForbiddenProps {
  rowData?: any
}
const props = withDefaults(defineProps<ForbiddenProps>(),{
  rowData: () => ({})
})

const dataArray = ref([])

onMounted(() => {
  if (!isEmpty(props.rowData)) {
    dataArray.value = [props.rowData]
  }
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' },
  { label: '状态', prop: 'status', useSlot: true }
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
.resource {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
