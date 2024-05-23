<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <info-approve-send
      :row-data="rowData"
      @clickCloseEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import infoApproveSend from './info-approve-send.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
// 属性值
interface DialogProps {
  type: string // 操作按钮类型
  rowData?: any // 行数据
  dialogTitle?: string
  dialogWidth?: string
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: 'create',
  rowData: null,
  dialogTitle: '',
  dialogWidth: '75%'
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogVisible = ref(true)

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

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
