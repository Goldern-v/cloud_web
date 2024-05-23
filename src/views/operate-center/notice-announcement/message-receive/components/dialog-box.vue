<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <add
      v-if="showAdd"
      :is-batch="isBatch"
      :select-array="selectArray"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <remove
      v-else-if="showRemove"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <notice-template
      v-else-if="showNotice"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import add from './add.vue'
import remove from './remove.vue'
import noticeTemplate from './notice-template.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  isBatch?: boolean, // 是否多选
  selectArray?: any[] // 多选数据
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  isBatch: false,
  selectArray: () => [],
  rowData: null
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表/（或设置监控项）
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showAdd = computed(() => props.type === OperateEventEnum.add)
const showRemove = computed(() => props.type === OperateEventEnum.remove)
const showNotice = computed(() => props.type === 'notice')
// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 类型变化,
watch(
  () => props.type,
  value => {
    initDialog()
  },
)

onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showAdd.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '添加接收人'
  } else if (showRemove.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '移除接收人'
  } else if (showNotice.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '通知模版'
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
