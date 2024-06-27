<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <expand
      v-if="showExpand"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <delete-file
      v-else-if="showDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-vpc
      v-else-if="showAddVpc"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-permission
      v-else-if="showAddPermission"
      :row-data="rowData"
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
import expand from './components/expand.vue'
import deleteFile from './components/delete-file.vue'
import addVpc from './components/add-vpc.vue'
import addPermission from './components/add-permission.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  multipleSelection?: string[] //多选
  selectMonitorIndicator?: string[] //已经选中的监控指标
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  rowData: null,
  selectMonitorIndicator: () => [],
  multipleSelection: () => []
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
const dialogWidth = ref('40%')

const showExpand = computed(() => props.type === OperateEventEnum.expand)
const showDelete = computed(() => props.type === OperateEventEnum.delete)
const showAddPermission = computed(() => props.type === 'addPermission')
const showAddVpc = computed(() => props.type === 'addVpc')
const showResourcePool = computed(() => props.type === 'resourcePool')

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 类型变化,
watch(
  () => props.type,
  value => {
    initDialog()
  }
)

onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showExpand.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '扩容'
  } else if (showDelete.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '删除文件系统'
  } else if (showAddPermission.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '添加授权地址'
  } else if (showAddVpc.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '添加VPC'
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
