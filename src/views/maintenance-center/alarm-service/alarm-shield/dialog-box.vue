<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <select-instance
      v-if="isAssociateInstance"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
    
    <select-resource
      v-else-if="showResourcePool"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import selectResource from './components/select-resource.vue';
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import selectInstance from './components/select-instance.vue'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined
  rowData?: any // 行数据
  isEdit?: boolean //显示创建或编辑
  multiContactPerson?: string[]
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  rowData: null,
  isEdit: false,
  multiContactPerson: () => []
})

const isAssociateInstance = computed(
  () => props.type === OperateEventEnum.associate
) //是否选择实例

const showCreate = computed(() => props.type === OperateEventEnum.create) //是否添加联系人

const showAddToContactGroup = computed(() => props.type === 'addToContactGroup') //是否添加到联系组
const showResourcePool = computed(() => props.type === 'resourcePool')
/**
 * 弹框
 */
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')
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
  if (!showResourcePool.value) {
    dialogVisible.value = false
  }
  
  emit(EventEnum.refresh)
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
  if (isAssociateInstance.value) {
    dialogTitle.value = '选择实例'
    dialogWidth.value = '40%'
  } else if (showCreate.value) {
    dialogTitle.value = '创建联系人'
  } else if (showAddToContactGroup.value) {
    dialogTitle.value = '添加到联系组'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  }
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
