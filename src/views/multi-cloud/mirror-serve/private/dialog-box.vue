<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <share
      v-if="showShare"
      :row-data="rowData"
      :select-data="selectData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <modify
      v-else-if="showModify"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <copy
      v-else-if="showCopy"
      :row-data="rowData"
      :select-data="selectData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-project
      v-else-if="showAddProject"
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
import share from './components/share.vue'
import modify from './components/modify.vue'
import copy from './components/copy.vue'
import addProject from './components/add-project.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum |  string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData?: any[]
}
const props = withDefaults(defineProps<DialogProps>(), {
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

const showShare = computed(() => props.type === OperateEventEnum.share)
const showModify = computed(() => props.type === OperateEventEnum.replace)
const showCopy = computed(() => props.type === OperateEventEnum.copy)
const showAddProject = computed(() => props.type === 'addProject')
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
  if (showShare.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '共享镜像'
  } else if (showModify.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '修改镜像'
  } else if (showCopy.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '复制镜像'
  } else if (showAddProject.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '添加租户'
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
  dialogVisible.value = false
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
