<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <ideal-resource-pool
      v-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <create
      v-else-if="showCreate || showEdit"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './components/create.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData?: any[] // 多选数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: '',
  rowData: null,
  selectData: () => []
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

const showCreate = computed(() => props.type === OperateEventEnum.create)
const showEdit = computed(() => props.type === OperateEventEnum.edit)
const showResourcePool = computed(() => props.type === 'resourcePool')
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
  if (showCreate.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '创建自定义策略'
  } else if (showEdit.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '修改自定义策略'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  }
}

// 弹框取消
const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 弹框成功提交
const clickSuccessEvent = () => {
  if (!showResourcePool.value) {
    dialogVisible.value = false
  }
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
