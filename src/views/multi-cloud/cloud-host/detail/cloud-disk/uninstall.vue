<template>
  <div>
    <div class="flex-row">
      <svg-icon icon="info-warning" class-name="info-warning" class="ideal-svg-margin-right"/>
      <div>确定卸载当前挂载云服务器</div>
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { cloudDiskDetach } from '@/api/java/store'

const { t } = useI18n()

interface UninstallProp {
  rowData?: any
}
const props = withDefaults(defineProps<UninstallProp>(),{
  rowData: () => ({})
})

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
  const params = {
    resourcePoolId: props.rowData?.pool?.id, // 资源池id
    regionId: props.rowData?.regionId, // 区域
    projectId: props.rowData?.project?.id, // 项目id
    id: props.rowData.id, // 云硬盘id(非uuid)
    instanceId: props.rowData.instanceId // 云主机id(非uuid)
  }
  showLoading('卸载中...')
  cloudDiskDetach(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('卸载成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('卸载失败')
    }
    hideLoading()
  }).catch(_ => {
    hideLoading()
  })
}
</script>

<style scoped lang="scss">
:deep(.info-warning) {
  color: $warningColor;
}
</style>
