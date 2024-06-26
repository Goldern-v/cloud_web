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
      :is-edit="isEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined | string // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')

const showCreate = computed(
  () =>
    props.type === OperateEventEnum.create ||
    props.type === OperateEventEnum.edit
) //创建/编辑
const isEdit = computed(() => props.type === OperateEventEnum.edit)
onMounted(() => {
  initDialog()
})

const initDialog = () => {
  dialogWidth.value = '40%'
  if (props.type === OperateEventEnum.create) {
    dialogTitle.value = '供应商信息注册'
  } else if (props.type === OperateEventEnum.edit) {
    dialogTitle.value = '供应商信息编辑'
  }
}

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

const clickSuccessEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.refresh)
}

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
</script>

<style scoped lang="scss">
:deep(.custom-input) {
  width: 90%;
}
</style>
