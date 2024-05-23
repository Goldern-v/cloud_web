<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create
      v-if="showCreate || showEdit"
      :is-edit="showEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create>
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined
  rowData?: any // 行数据
  isEdit?: boolean //显示创建或编辑
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  rowData: null,
  isEdit: false
})

const showEdit = computed(() => props.type === OperateEventEnum.edit) //是否编辑页面
const showCreate = computed(() => props.type === OperateEventEnum.create)
/* 
弹框
 */
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')
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
  if (showEdit.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '编辑目录配置'
  } else if (showCreate.value){
    dialogWidth.value = '40%'
    dialogTitle.value = '添加目录配置'
  }
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
