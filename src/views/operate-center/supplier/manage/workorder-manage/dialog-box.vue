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

    <order-detail
      v-else-if="showDetail"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import delivery from './delivery.vue'
import orderDetail from './detail.vue'
import { EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: undefined | string // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const form = {
  remark: ''
}
// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showDelivery = computed(() => props.type === 'delivery')
const showDetail = computed(() => props.type === 'detail')
onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showDelivery.value) {
    dialogVisible.value = true
    dialogTitle.value = '交付'
    dialogWidth.value = '30%'
  }
  if (showDetail.value) {
    dialogVisible.value = true
    dialogTitle.value = '工单详情'
    dialogWidth.value = '50%'
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
