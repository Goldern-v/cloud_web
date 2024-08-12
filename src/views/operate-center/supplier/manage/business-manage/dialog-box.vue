<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <port-data-entry
      v-if="showPortDataEntry || showPortDataEdit"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <specific-port-data-entry
      v-else-if="showSpecificPortDataEntry || showSpecificPortDataEdit"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <dci-data-entry
      v-else-if="showDciDataEntry || showDciDataEdit"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
    <service-token
      v-else-if="showServiceToken"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import portDataEntry from './cloud-port/data-entry.vue'
import specificPortDataEntry from './specific-port/data-entry.vue'
import serviceToken from './specific-port/serviceToken.vue'
import dciDataEntry from './DCI/data-entry.vue'
import { EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: undefined | string // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const form = {
  remark: ''
}
// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showPortDataEntry = computed(() => props.type === 'portDataEntry') //端口数据录入
const showPortDataEdit = computed(() => props.type === 'portDataEdit') //端口数据编辑
const showSpecificPortDataEntry = computed(
  () => props.type === 'specificPortDataEntry'
) //专用端口数据编辑
const showSpecificPortDataEdit = computed(
  () => props.type === 'specificPortDataEdit'
) //专用端口数据编辑
const showDciDataEntry = computed(() => props.type === 'DCIDataEntry') //DCI数据录入
const showDciDataEdit = computed(() => props.type === 'DCIDataEdit') //DCI数据编辑
const showServiceToken = computed(() => props.type === 'serviceToken') //Service Token
onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showPortDataEntry.value) {
    dialogVisible.value = true
    dialogTitle.value = '端口数据录入'
    dialogWidth.value = '40%'
  }
  if (showPortDataEdit.value) {
    dialogVisible.value = true
    dialogTitle.value = '编辑端口数据'
    dialogWidth.value = '40%'
  } else if (showDciDataEntry.value) {
    dialogVisible.value = true
    dialogTitle.value = 'DCI数据录入'
    dialogWidth.value = '50%'
  } else if (showDciDataEdit.value) {
    dialogVisible.value = true
    dialogTitle.value = 'DCI数据编辑'
    dialogWidth.value = '50%'
  } else if (showSpecificPortDataEntry.value) {
    dialogVisible.value = true
    dialogTitle.value = '专用端口数据录入'
    dialogWidth.value = '40%'
  } else if (showSpecificPortDataEdit.value) {
    dialogVisible.value = true
    dialogTitle.value = '编辑专用端口数据'
    dialogWidth.value = '40%'
  } else if (showServiceToken.value) {
    dialogVisible.value = true
    dialogTitle.value = 'Service Token'
    dialogWidth.value = '40%'
  }
}

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

const clickSuccessEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.refresh)
}

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
</script>

<style scoped lang="scss">
:deep(.custom-input) {
  width: 90%;
}
</style>
