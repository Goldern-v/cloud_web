<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <sync-bill
      v-if="showSync"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <multi-delete
      v-else-if="showDelete"
      :selection-data="selectionData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-domain
      v-else-if="showAddDomain"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <set-platform
      v-else-if="showSetPlatform"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import syncBill from './components/sync-bill.vue'
import multiDelete from './components/multi-delete.vue'
import addDomain from './components/add-domain.vue'
import setPlatform from './components/set-platform.vue'
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
const showSync = computed(() => props.type === OperateEventEnum.sync)
const showDelete = computed(() => props.type === OperateEventEnum.delete)
const showAddDomain = computed(() => props.type === 'addDomain')
const showSetPlatform = computed(() => props.type === 'set-platform')
const initDialog = () => {
  if (showSync.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '同步账单'
  } else if (showDelete.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '删除'
  } else if (showAddDomain.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '新增域名地址'
  }
}
// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh, v: any): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
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
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
