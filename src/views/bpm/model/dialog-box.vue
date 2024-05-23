<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <new-process
      v-if="showNewProcess"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></new-process>
    <edit-process
      v-if="showEditProcess"
      :row-data="props.rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></edit-process>
    <edit-rule
      v-if="showEditRule"
      :row-data="props.rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></edit-rule>
    <model-detail
      v-if="showModelDetail"
      :row-data="props.rowData"
    ></model-detail>
    <form-detail v-if="showFormDetail" :row-data="props.rowData"></form-detail>
  </el-dialog>
</template>

<script setup lang="ts">
import editProcess from './components/editProcess.vue'
import newProcess from './components/newProcess.vue'
import editRule from './components/editRule.vue'
import modelDetail from './components/modelDetail.vue'
import formDetail from './components/formDetail.vue'
import { EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: string | undefined // 操作按钮类型
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

const showNewProcess = computed(() => props.type === 'newProcess')
const showEditProcess = computed(() => props.type === 'editProcess')
const showEditRule = computed(() => props.type === 'editRule')
const showModelDetail = computed(() => props.type === 'modelDetail')
const showFormDetail = computed(() => props.type === 'formDetail')

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
  dialogWidth.value = '30%'
  if (showNewProcess.value) {
    dialogTitle.value = '新建流程'
  } else if (showEditProcess.value) {
    dialogTitle.value = '修改流程'
  } else if (showEditRule.value) {
    dialogTitle.value = '修改规则'
  } else if (showModelDetail.value) {
    dialogTitle.value = '流程详情'
    dialogWidth.value = '60%'
  } else if (showFormDetail.value) {
    dialogTitle.value = '表单详情'
    dialogWidth.value = '50%'
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
