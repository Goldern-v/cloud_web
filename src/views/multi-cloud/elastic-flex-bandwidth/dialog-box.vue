<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <forbidden
      v-if="showForbidden"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <immediate
      v-else-if="showImmediate"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

  </el-dialog>
</template>

<script setup lang="ts">
import forbidden from './components/forbidden.vue'
import immediate from './components/immediate.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData? : any[] // 多选数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: undefined,
  rowData: null,
  selectData: () => ([])
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
// 停用
const showForbidden = computed(() => props.type === OperateEventEnum.forbidden) 
// 立即执行
const showImmediate = computed(() => props.type === OperateEventEnum.immediate) 
// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 类型变化,
watch(
  () => props.type,
  () => {
    initDialog()
  }
)
onMounted(() => {
  initDialog()
})
const initDialog = () => {
  if (showForbidden.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '停用伸缩带宽策略'
  } else if (showImmediate.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '执行伸缩带宽策略'
  }
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
