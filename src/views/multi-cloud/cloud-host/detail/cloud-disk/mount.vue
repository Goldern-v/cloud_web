<template>
  <div class="mount">
    <ideal-table-list
      row-key="uuid"
      :table-data="dataArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-radio="true"
      @clickTableCellRow="clickTableCellRow"
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
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
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, BillingEnum } from '@/utils/enum'
import { cloudDiskAttach, cloudDiskList } from '@/api/java/store'
import { showLoading, hideLoading } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'

// 属性值
interface DialogProps {
  detail?: any // 云主机id
}
const props = withDefaults(defineProps<DialogProps>(), {
  detail: null,
})

const { t } = useI18n()

onMounted(() => {
  if (props.detail) {
    queryCloudDisk()
  }
})

const dataArray = ref<any[]>([])
// 查可用云硬盘
const queryCloudDisk = () => {
  const params = {
    resourcePoolId: props.detail?.pool?.id, // 资源池id
    regionId: props.detail?.regionId, // 区域
    availableZone: props.detail?.availableZone, // 可用区
    projectId: props.detail?.project?.id, // 项目id
    status: 'AVAILABLE'
  }

  cloudDiskList(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      dataArray.value = data
    } else {
      dataArray.value = []
    }
  }).catch(_ => {
    dataArray.value = []
  })
}
watch(() => dataArray.value, value => {
  if (value?.length) {
    value.forEach((item: any) => {
      item.billTypeText = item.billType === BillingEnum.ON_DEMAND ? '按需' : '包年包月'
      item.encryptionDisk = item.encrypted ? '是' : '否'
      item.createDate = item.createTime.date
      item.shareableText = item.shareable ? '共享盘':'普通云硬盘'
      item.startupDisk = item.bootable ? '是' : '否'
      item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
      item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
    })
  }
}, { deep: true })

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '可用区', prop: 'availableZone' },
  { label: '容量(GiB)', prop: 'size' }
]
// 当前选择结果
const currentRow = ref()
// 列表选择
const clickTableCellRow = (row: any) => {
  currentRow.value = row
}
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
  const params = {
    resourcePoolId: props.detail?.pool?.id, // 资源池id
    regionId: props.detail?.regionId, // 区域
    projectId: props.detail?.project?.id, // 项目id
    id: currentRow.value.id, // 云硬盘id(非uuid)
    instanceId: props.detail.id // 云主机id(非uuid)
  }
  showLoading('挂载中...')
  cloudDiskAttach(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('挂载成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('挂载失败')
    }
    hideLoading()
  }).catch(_ => {
    hideLoading()
  })
}
</script>

<style scoped lang="scss">
.mount {
  width: 100%;
}
</style>
