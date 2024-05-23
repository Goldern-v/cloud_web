<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <close-rule
      v-if="showClose"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-rule
      v-else-if="showAdd || showForward || showBackwards"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <change-rule
      v-else-if="showChange"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import closeRule from './close.vue'
import addRule from './add-rule.vue'
import changeRule from './change-rule.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | undefined // 操作按钮类型
  typeStr?: string // 类型字符串(不是常用到的就不新增枚举了)
  rowData?: any // 行数据
  selectData? : any[] // 多选数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: undefined,
  typeStr: '',
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

const showClose = computed(() => props.type === OperateEventEnum.close)
const showAdd = computed(() => props.type === OperateEventEnum.add)
const showForward = computed(() => props.type === OperateEventEnum.forward)
const showBackwards = computed(() => props.type === OperateEventEnum.backwards)
const showChange = computed(() => props.type === OperateEventEnum.change)

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
  if (showClose.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '关闭入方向规则'
  } else if (showAdd.value) {
    dialogWidth.value = '75%'
    dialogTitle.value = '添加入方向规则'
  } else if (showForward.value) {
    dialogWidth.value = '75%'
    dialogTitle.value = '向前插入规则'
  } else if (showBackwards.value) {
    dialogWidth.value = '75%'
    dialogTitle.value = '向后插入规则'
  } else if (showChange.value) {
    dialogWidth.value = '70%'
    dialogTitle.value = '修改入方向规则'
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
