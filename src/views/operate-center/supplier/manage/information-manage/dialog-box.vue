<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <node-info
      v-if="showNodeOperate"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <device-info
      v-if="showDeviceOperate"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <specific-port
      v-if="showSpecificOperate"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <nni-port
      v-if="showNNIOperate"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <cloud-port
      v-if="showCloudPort"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import nodeInfo from '../information-manage/information-entry/node-info.vue'
import deviceInfo from '../information-manage/information-entry/device-info.vue'
import specificPort from './port-info/specific-port.vue'
import nniPort from './port-info/nni-port.vue'
import cloudPort from './port-info/cloud-port.vue'
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
const dialogWidth = ref('30%')

const showNodeOperate = computed(() =>
  RegExp(/(Node)/i).test(props.type as string)
) //创建\编辑节点
const showDeviceOperate = computed(() =>
  RegExp(/(Device)/i).test(props.type as string)
) //创建\编辑设备
const showSpecificOperate = computed(() =>
  RegExp(/(Specific)/i).test(props.type as string)
) //创建\编辑专用端口
const showNNIOperate = computed(() =>
  RegExp(/(Nni)/i).test(props.type as string)
) //创建\编辑NNI端口
const showCloudPort = computed(() =>
  RegExp(/(Ali|Aws|Azure)/i).test(props.type as string)
)

onMounted(() => {
  initDialog()
})

const initDialog = () => {
  let type = ''
  const operate = props.type?.includes('create') ? '创建' : '编辑'
  if (showNodeOperate.value) {
    type = '节点'
  } else if (showDeviceOperate.value) {
    type = '设备'
  } else if (showSpecificOperate.value) {
    type = '专用端口'
  } else if (showNNIOperate.value) {
    type = 'NNI端口'
  } else if (props.type?.includes('Ali')) {
    type = '阿里端口'
  } else if (props.type?.includes('Aws')) {
    type = 'Aws端口'
  } else if (props.type?.includes('Azure')) {
    type = 'Azure端口'
  }
  dialogTitle.value = `${operate}${type}`
  dialogWidth.value = props.type?.includes('Azure')
    ? '60%'
    : props.type?.includes('Specific')
    ? '40%'
    : '30%'
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
