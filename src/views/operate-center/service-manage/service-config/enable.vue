<template>
  <div class="enabled">
    <div class="flex-row">
      <svg-icon icon="info-warning" class="ideal-svg-margin-right" :class-name="type === OperateEventEnum.enable ? 'info-warning-enable':'info-warning-forbidden'"/>
      <div v-if="type === OperateEventEnum.enable">启用底层资源</div>
      <div v-else-if="type === OperateEventEnum.forbidden">禁用底层资源</div>
      <div v-else>删除底层资源</div>
    </div>

    <div v-if="type === OperateEventEnum.enable">启用后可在申请或创建资源时选择当前资源信息。</div>
    <div v-else-if="type === OperateEventEnum.forbidden">禁用后申请或创建资源时不展示当前资源信息。</div>
    <div v-else>确定要删除当前底层资源配置信息吗？</div>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { serviceConfigResourceBatch, serviceConfigResourceBatchDelete } from '@/api/java/operate-center'

interface DialogProps {
  type: OperateEventEnum | string | undefined
  selectData?: any[] // 多选
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: OperateEventEnum.enable,
  selectData: () => []
})

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
  if (props.type === OperateEventEnum.enable) {
    batchStatus(true)
  } else if (props.type === OperateEventEnum.forbidden) {
    batchStatus(false)
  } else {
    handleDelete()
  }
}
// 批量启用、停用
const batchStatus = (status: boolean) => {
  const tip = status ? '启用' : '停用'
  const tempArr = props.selectData.map((item: any) => {
    return item.id
  })
  const params = {
    ids: tempArr.join(','),
    status
  }
  serviceConfigResourceBatch(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success(`底层资源${tip}成功`)
    } else {
      ElMessage.error(`底层资源${tip}失败`)
    }
  })
}
const handleDelete = () => {
  const tempArr = props.selectData.map((item: any) => {
    return item.id
  })
  const params = {
    ids: tempArr.join(',')
  }
  serviceConfigResourceBatchDelete(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success(`批量删除成功`)
    } else {
      ElMessage.error(`批量删除失败`)
    }
  })
}
</script>

<style scoped lang="scss">
.enabled {
  width: 100%;
  :deep(.info-warning-enable) {
    color: var(--el-color-primary)
  }
  :deep(.info-warning-forbidden) {
    color: $warningColor;
  }
}
</style>
