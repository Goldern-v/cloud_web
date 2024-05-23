<template>
  <div class="multi-delete">
    <div>确定删除所选云平台吗?</div>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { cloudPlatformBatchDelete } from '@/api/java/operate-center'

interface MultiDeleteProps {
  selectionData?: any[]
}
const props = withDefaults(defineProps<MultiDeleteProps>(), {
  selectionData: () => []
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
  const params = {
    ids: props.selectionData.join(',')
  }
  console.log('---params----', params)
  cloudPlatformBatchDelete(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('删除成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<style scoped lang="scss">
.multi-delete {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
