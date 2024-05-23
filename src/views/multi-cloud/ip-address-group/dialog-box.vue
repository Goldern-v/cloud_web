<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create-ip-address-group
      v-if="showIpGroup"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create-ip-address-group>

    <add-ip-address
      v-if="showAddIp || showEditIp"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-ip-address>
    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import createIpAddressGroup from './create.vue'
import addIpAddress from './detail/add-ip-address..vue'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined | string // 操作按钮类型
  rowData?: any // 行数据
  selectMonitorIndicator?: string[] //已经选中的监控指标
  multipleSelection?: any[] //多选
}
const props = withDefaults(defineProps<DialogProps>(), {
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
const dialogWidth = ref('35%')

const showIpGroup = computed(() => props.type === OperateEventEnum.create) //创建IP地址组
const showAddIp = computed(() => props.type === OperateEventEnum.add) //添加IP地址
const showEditIp = computed(() => props.type === OperateEventEnum.edit) //添加IP地址
const showResourcePool = computed(() => props.type === 'resourcePool') //资源池类型

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
  if (showIpGroup.value) {
    dialogTitle.value = '创建IP地址组'
  } else if (showAddIp.value) {
    dialogTitle.value = '添加P地址'
  } else if (showEditIp.value) {
    dialogTitle.value = '修改IP地址'
  } else if (showResourcePool.value) {
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
  // dialogVisible.value = false
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
