<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
    class="custom-class"
  >
    <script-view
      v-if="showInstall || showUpgrade"
      :type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </script-view>

    <create v-else-if="showCreate"></create>
  </el-dialog>
</template>

<script setup lang="ts">
import scriptView from './script.vue'
import create from './create.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})
const dialogVisible = ref(true) // 是否显示弹框

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

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
const showInstall = computed(() => props.type === OperateEventEnum.install)
const showUpgrade = computed(() => props.type === OperateEventEnum.upgrade)
const showCreate = computed(() => props.type === OperateEventEnum.create)
const initDialog = () => {
  if (showInstall.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '下载安装脚本'
  } else if (showUpgrade.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '升级脚本'
  } else if (showCreate.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '创建云网关'
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
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
<style lang="scss">
.custom-class {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
