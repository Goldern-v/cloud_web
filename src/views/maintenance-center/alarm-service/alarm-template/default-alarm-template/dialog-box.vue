<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <copy-template
      v-if="isCopyTemplate"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </copy-template>
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import copyTemplate from './copy-template.vue'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const isCopyTemplate = computed(() => props.type === OperateEventEnum.copy) //是否复制模板

/**
 * 弹框
 */
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')
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
  if (isCopyTemplate.value) {
    dialogTitle.value = '复制模板'
  }
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
