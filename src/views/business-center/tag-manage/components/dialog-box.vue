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
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></bind>

    <edit
      v-if="showEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </edit>

    <batch-delete
      v-if="showBatchDelete"
      :multiple-selection="multipleSelection"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></batch-delete>
  </el-dialog>
</template>

<script setup lang="ts">
import bind from './bind.vue'
import edit from './edit.vue'
import batchDelete from './batch-delete.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
  rowData?: any // 行数据
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  multipleSelection: () => []
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
const showEdit = computed(() => props.type === OperateEventEnum.edit)
const showBatchDelete = computed(() => props.type === OperateEventEnum.delete)
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
    dialogWidth.value = '55%'
    dialogTitle.value = '资源绑定'
  } else if (showEdit.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '编辑'
  } else if (showBatchDelete.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '批量删除'
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
