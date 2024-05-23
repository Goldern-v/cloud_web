<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <immediate
      v-if="showImmediate"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
    <forbidden
      v-else-if="showForbidden"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
    <add-policy
      v-else-if="showAddPolicy"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <resource
      v-else-if="showCheck"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import immediate from './immediate.vue'
import forbidden from './forbidden.vue'
import addPolicy from './add-policy.vue'
import resource from './resource.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | undefined // 操作按钮类型
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

const showImmediate = computed(() => props.type === OperateEventEnum.immediate)
const showForbidden = computed(() => props.type === OperateEventEnum.forbidden)
const showAddPolicy = computed(() => props.type === OperateEventEnum.create)
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
  if (showImmediate.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '执行伸缩策略'
  } else if (showForbidden.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '停用伸缩策略'
  } else if (showAddPolicy.value) {
    dialogWidth.value = '70%'
    dialogTitle.value = '添加伸缩策略'
  } else if (showCheck.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = props.rowData.alarmName
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
