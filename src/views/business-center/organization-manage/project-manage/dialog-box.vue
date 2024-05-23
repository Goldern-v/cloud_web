<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create
      v-if="showCreate"
      :row-data="rowData"
      :is-edit="isEdit"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create>
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})
const dialogVisible = ref(true) // 是否显示弹框

// 方法
interface EmitEvent {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EmitEvent>()

// 弹框
const dialogTitle = ref('')
const dialogWidth = ref('30%')

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
const showCreate = computed(
  () =>
    props.type === OperateEventEnum.create ||
    props.type === OperateEventEnum.edit
)
const isEdit = computed(() => props.type === OperateEventEnum.edit)
const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '新建项目'
  } else if (isEdit.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '编辑项目'
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
