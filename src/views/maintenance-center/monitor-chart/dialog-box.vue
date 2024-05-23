<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <set-monitor
        v-if="showSetMonitor"
        :select-monitor-indicator="selectMonitorIndicator"
        @clickCancelEvent="clickCancelEvent"
        @clickSuccessEvent="clickSuccessEvent"
      ></set-monitor>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import setMonitor from './set-monitor.vue'
// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
  selectMonitorIndicator?: string[] //已经选中的监控指标
}
const props = withDefaults(defineProps<DialogProps>(), {
  selectMonitorIndicator: () => []
})
const showSetMonitor = computed(() => props.type === OperateEventEnum.monitor) //设置监控指标

onMounted(() => {
  if (showSetMonitor.value) {
    dialogTitle.value = '设置监控'
  }
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表/（或设置监控项）
}
const emit = defineEmits<EventEmits>()
// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

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
