<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <delivery
      v-if="showDelivery"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <order-reject
      v-else-if="showReject"
      :type="type"
      :row-id="rowId"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import delivery from './delivery.vue'
import orderReject from './reject.vue'
import { EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: undefined | string // 操作按钮类型
  rowData?: any // 行数据
  rowId?: string // 订单号
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  rowId: ''
})

const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showDelivery = computed(() => props.type === 'delivery')
const showReject = computed(() => props.type === 'reject')
onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showDelivery.value) {
    dialogVisible.value = true
    dialogTitle.value = '交付'
    dialogWidth.value = '30%'
  }
  if (showReject.value) {
    dialogVisible.value = true
    dialogTitle.value = '驳回'
    dialogWidth.value = '30%'
  }
}

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
