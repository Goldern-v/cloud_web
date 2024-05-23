<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create
      v-if="showCreate"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <upgrade
      v-if="showUpgrade"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <import-view
      v-else-if="showImport"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <export-view
      v-else-if="showExport"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <clear
      v-else-if="showClear"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import upgrade from './upgrade.vue'
import importView from './import.vue'
import exportView from './export.vue'
import clear from './clear.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
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

// 创建｜编辑事件共用同一个视图
const showCreate = computed(
  () =>
    props.type === OperateEventEnum.create ||
    props.type === OperateEventEnum.edit
)
// 组件内区分新增和编辑
const isEdit = computed(() => props.type === OperateEventEnum.edit)
// 导入密钥对操作
const showImport = computed(() => props.type === OperateEventEnum.import)
const showUpgrade = computed(() => props.type === OperateEventEnum.upgrade)
const showExport = computed(() => props.type === OperateEventEnum.export)
const showClear = computed(() => props.type === OperateEventEnum.clear)
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
    dialogWidth.value = '50%'
    if (isEdit.value) {
      dialogTitle.value = '编辑密钥对'
    } else {
      dialogTitle.value = '创建密钥对'
    }
  } else if (showImport.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '导入密钥对'
  } else if (showUpgrade.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '升级密钥对'
  } else if (showExport.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '导出私钥'
  } else if (showClear.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '清除私钥'
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
