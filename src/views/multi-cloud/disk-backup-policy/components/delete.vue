<template>
  <div class="delete">
    <div>您即将删除策略defaultPolicy</div>
    <div>如果策略已经绑定存储库，删除策略后会将停止自动备份，请谨慎操作。</div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称/ID" width="210" show-overflow-tooltip>
          <template #default="props">
            <el-button link class="cloud-disk-font-size">{{ props.row.name }}</el-button>
            <div class="cloud-disk-table-id">{{ props.row.uuid }}</div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="是否启用" width="160">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import { isEmpty } from '@/utils/is'
import type { IdealTableColumnHeaders } from '@/types'

interface ShutdownProp {
  rowData?: any
}
const props = withDefaults(defineProps<ShutdownProp>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const tableArray = ref<any[]>([])
onMounted(() => {
  if (!isEmpty(props.rowData)) {
    tableArray.value = [props.rowData]
  }
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '是否启用', prop: 'status', useSlot: true },
  { label: '备份时间', prop: 'backupTime' },
  { label: '备份周期', prop: 'backupCycle' },
  { label: '保留规则', prop: 'saveRule' }
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
.delete {
  width: 100%;
}
</style>
