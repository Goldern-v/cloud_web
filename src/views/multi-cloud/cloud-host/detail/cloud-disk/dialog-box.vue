<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <mount
      v-if="showMount"
      :detail="detail"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>

    <uninstall
      v-if="showUninstall"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>

    <ideal-resource-pool
      v-if="showSelectPool"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>
  </el-dialog>
</template>

<script setup lang="ts">
import mount from './mount.vue'
import uninstall from './uninstall.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  detail?: any // 云主机详情
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  detail: null
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

const showMount = computed(() => props.type === OperateEventEnum.mount)
const showUninstall = computed(() => props.type === OperateEventEnum.uninstall)
const showSelectPool = computed(() => props.type === 'selectPool')
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
  if (showMount.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '挂载磁盘'
  } else if (showUninstall.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '卸载'
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
