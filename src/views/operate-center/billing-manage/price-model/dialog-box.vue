<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <add-charge-item
      v-if="showAddCostItem"
      :cost-type="constType"
      :exit-charge-item="exitChargeItem"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-charge-item>
    <ideal-table-list
      v-if="showChargeItem"
      :loading="loading"
      :show-pagination="false"
      :table-data="rowData.billableItemsPrices"
      :table-headers="tableHeaders"
      style="margin-bottom: 15px"
    >
      <template #price>
        <el-table-column label="计费价格/单位">
          <template #default="props">
            <div v-for="(item, index) in props.row.priceText" :key="index">
              {{ item }}
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </el-dialog>
</template>

<script setup lang="ts">
import addChargeItem from './add-charge-item.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | string | undefined
  rowData?: any // 行数据
  constType?: string //费用类型
  exitChargeItem?: any //已添加的计费项
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  rowData: null,
  constType: '',
  exitChargeItem: []
})

const showAddCostItem = computed(() => props.type === 'addChargeItem') // 创建计费项弹窗
const showChargeItem = computed(() => props.type === 'chargeItem') // 查看计费项弹窗

onMounted(() => {
  initDialog()
})
const initDialog = () => {
  if (showAddCostItem.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '添加计费项'
  } else if (showChargeItem.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '查看计费项'
  }
}

/*
 *列表
 */
const loading = ref(false)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '计费项', prop: 'billableItems.name' },
  { label: '计费单元', prop: 'unit' },
  { label: '计费价格/单位', prop: 'price', useSlot: true },
  { label: '周期', prop: 'billCycleText' }
]

/*
 *弹框
 */
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')
// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh, v: object): void // 表单成功提交后刷新列表
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
const clickSuccessEvent = (value: any) => {
  dialogVisible.value = false
  emit(EventEnum.refresh, value)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
