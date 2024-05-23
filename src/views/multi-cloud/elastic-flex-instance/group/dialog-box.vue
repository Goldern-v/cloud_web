<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <flex-config
      v-if="showCheck"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <replace-flex-config
      v-else-if="showReplace"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <change-flex-config
      v-else-if="showChange"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <edit 
      v-else-if="showEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import flexConfig from './components/flex-config.vue'
import replaceFlexConfig from './components/replace-flex-config.vue'
import changeFlexConfig from './components/change-flex-config.vue'
import edit from './edit.vue'
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
// 选择伸缩配置
const showCheck = computed(() => props.type === OperateEventEnum.check)
// 更换伸缩配置
const showReplace = computed(() => props.type === OperateEventEnum.replace)
// 修改伸缩配置
const showChange = computed(() => props.type === OperateEventEnum.change)
// 修改伸缩组
const showEdit = computed(() => props.type === OperateEventEnum.edit)
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
  if (showCheck.value) {
    dialogWidth.value = '70%'
    dialogTitle.value = '选择伸缩配置'
  } else if (showReplace.value) {
    dialogWidth.value = '70%'
    dialogTitle.value = '更换伸缩配置'
  } else if (showChange.value) {
    dialogWidth.value = '80%'
    dialogTitle.value = '修改伸缩配置'
  } else if (showEdit.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '修改伸缩组'
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
