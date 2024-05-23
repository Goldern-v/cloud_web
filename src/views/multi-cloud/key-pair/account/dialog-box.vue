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
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <import-view
      v-else-if="showImport"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import importView from './import.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
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

// 创建｜编辑事件共用同一个视图
const showCreate = computed(
  () =>
    props.type === OperateEventEnum.create ||
    props.type === OperateEventEnum.edit
)
// 组件内区分新增和编辑
const isEdit = computed(() => props.type === OperateEventEnum.edit)

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
  if (showCreate.value) {
    dialogWidth.value = '50%'
    if (isEdit.value) {
      dialogTitle.value = '编辑密钥对'
    } else {
      dialogTitle.value = '创建密钥对'
    }
  } else if (showImport.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '导入密钥对'
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
// 导入密钥对操作
const showImport = computed(() => props.type === OperateEventEnum.import)
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
