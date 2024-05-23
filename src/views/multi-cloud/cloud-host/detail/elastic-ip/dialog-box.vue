<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <bind
      v-if="showBind"
      :detail="detail"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>

    <unbind
      v-else-if="showUnbind"
      :row-data="rowData"
      :detail="detail"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>
  </el-dialog>
</template>

<script setup lang="ts">
import bind from './bind.vue'
import unbind from './unbind.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData? : any[] // 多选数据
  detail?: any
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: undefined,
  rowData: null,
  selectData: () => ([]),
  detail: () => ([])
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

const showBind = computed(() => props.type === OperateEventEnum.bind)
const showUnbind = computed(() => props.type === OperateEventEnum.unbind)
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
  if (showBind.value) {
    dialogWidth.value = '65%'
    dialogTitle.value = '绑定弹性公网IP'
  } else if (showUnbind.value) {
    dialogWidth.value = '65%'
    dialogTitle.value = '解绑弹性公网IP'
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
