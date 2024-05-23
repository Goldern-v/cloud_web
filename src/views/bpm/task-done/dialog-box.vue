<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.dialogTitle"
    :width="props.dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <detail :row-data="props.rowData" />
  </el-dialog>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import detail from './detail.vue'

// 属性值
interface DialogProps {
  rowData?: any // 行数据
  dialogTitle?: string
  dialogWidth?: string
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  dialogTitle: '详情',
  dialogWidth: '50%'
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

onMounted(() => {})

// 弹框取消
const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 弹框成功提交
const clickSuccessEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
