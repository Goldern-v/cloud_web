<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <copy
      v-if="showCopy"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <select-cloud-host
      v-if="showCheck"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import copy from './components/copy.vue'
import selectCloudHost from './components/select-cloud-host.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
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

const showCopy = computed(() => props.type === OperateEventEnum.copy)
const showCheck = computed(() => props.type === OperateEventEnum.check)
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
  if (showCopy.value) {
    dialogWidth.value = '70%'
    dialogTitle.value = '复制伸缩配置'
  } else if (showCheck.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '请选择云服务器'
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
