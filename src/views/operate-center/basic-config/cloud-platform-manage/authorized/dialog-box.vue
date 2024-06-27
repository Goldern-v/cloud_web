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

    <bind
      v-if="showBind"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import bind from './bind.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectionData?: any[]
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  selectionData: () => []
})

const dialogVisible = ref(true) // 是否显示弹框
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
const showCreate = computed(() => props.type === OperateEventEnum.create)
const showBind = computed(() => props.type === OperateEventEnum.bind)
const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '新增授权账户'
  } else if (showBind.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '绑定云管用户'
  }
}
// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh, v?: any): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
// 弹框取消
const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 弹框成功提交
const clickSuccessEvent = (value?: any) => {
  dialogVisible.value = false
  emit(EventEnum.refresh, value)
}
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
