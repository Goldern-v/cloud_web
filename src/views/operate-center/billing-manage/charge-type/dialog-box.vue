<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <add-charge-type
      v-if="showCostType"
      :is-edit="isEdit"
      :row-data="expenseTypeData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-charge-type>

    <add-charge-item
      v-else-if="showBillItem"
      :is-edit="isEdit"
      :expense-type-data="expenseTypeData"
      :row-data="billItemData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-charge-item>
  </el-dialog>
</template>

<script setup lang="ts">
import addChargeType from './add-charge-type.vue'
import addChargeItem from './add-charge-item.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined
  expenseTypeData?: any //费用类型数据
  billItemData?: any // 计费项行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  expenseTypeData: () => ({}),
  billItemData: null
})

const showCostType = computed(
  () =>
    props.type === OperateEventEnum.add || props.type === OperateEventEnum.edit
) // 是否费用类型操作弹窗

const showBillItem = computed(
  () => props.type === 'addChargeItem' || props.type === 'editChargeItem'
) // 是否计费项操作弹窗

const isEdit = computed(
  () => props.type === 'editChargeItem' || props.type === OperateEventEnum.edit
) //是否编辑页面

onMounted(() => {
  initDialog()
})

watch(
  () => props.type,
  () => {
    initDialog()
  }
)

/*
 *弹窗
 */

const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
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
const initDialog = () => {
  if (showCostType.value) {
    dialogTitle.value = '创建费用类型'
    if (isEdit.value) {
      dialogTitle.value = '编辑费用类型'
    }
  } else if (showBillItem.value) {
    dialogTitle.value = '创建计费项'
    if (isEdit.value) {
      dialogTitle.value = '编辑计费项'
    }
  }
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
