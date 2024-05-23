<template>
  <div class="destroy">
    <div>确定要对以下云硬盘行销毁操作吗?</div>

    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeader"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.uuid }}</div>
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

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { cloudDiskRecycleDelete } from '@/api/java/store'
import { isEmpty, isUnDef } from '@/utils/is'
import { showLoading, hideLoading } from '@/utils/tool'

interface HangUpProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<HangUpProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  if (!isEmpty(props.rowData) && !isUnDef(props.rowData)) {
    tableData.value = [props.rowData]
  }
})

const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '磁盘模式', prop: 'volumeMode' }
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
  showLoading('销毁中...')
  const params = {
    id: props.rowData.id,
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
  cloudDiskRecycleDelete(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('云硬盘销毁成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(data.msg || '云硬盘销毁失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.destroy {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
