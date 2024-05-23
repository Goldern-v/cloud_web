<template>
  <div class="recover">
    <div>确定要对以下1台云服务器进行恢复操作吗？</div>

    <ideal-table-list
      :table-data="originalData"
      :table-headers="originalHeader"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.id }}</div>
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
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
interface RecoverProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<RecoverProps>(), {
  rowData: () => ({})
})
// 原有规格数据
const originalData: any = ref([
  // props.rowData
  {
    name: 'est1.1',
    id: '3435335355ssgggfgggefdfdfdf',
    status: '关机',
    statusType: 'status-error',
    mirror: '公共镜像-wew.ffafafhdfudfhufhufhu',
    spec: '1核 | 1G',
    createTime: '2023-07-17 17:41:22'
  }
])
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '备注', prop: 'remark' }
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

const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.recover {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
