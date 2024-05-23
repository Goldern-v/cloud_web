<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <variation
      v-if="showVariation"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <expand
      v-else-if="showExpand"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <adjust-network
      v-else-if="showAdjustNetwork"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <unsubscribe
      v-else-if="showUnsubscribe"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <renew
      v-else-if="showRenew"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <reboot
      v-else-if="showReboot"
      :table-array="selectArray"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <power-on
      v-else-if="showPowerOn"
      :table-array="selectArray"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <shutdown
      v-else-if="showShutdown"
      :table-array="selectArray"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <hang-up
      v-else-if="showHangUp"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <recover
      v-else-if="showRecover"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <reset-pwd
      v-else-if="showResetPwd"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <delete-view
      v-else-if="showDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-associate-tag
      v-else-if="showAssociateTag"
      :row-data="rowData"
      :resource-type-code="resourceTypeEnum.ECS"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-unbind-tag
      v-else-if="showUnbindTag"
      :resource-type-code="resourceTypeEnum.ECS"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <protocol
      v-else-if="showProtocol"
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
import variation from './order/variation.vue'
import expand from './order/expand.vue'
import adjustNetwork from './order/adjust-network.vue'
import unsubscribe from './order/unsubscribe.vue'
import renew from './order/renew.vue'
import reboot from './order/reboot.vue'
import powerOn from './order/power-on.vue'
import shutdown from './order/shutdown.vue'
import hangUp from './order/hang-up.vue'
import recover from './order/recover.vue'
import resetPwd from './order/reset-pwd.vue'
import deleteView from './order/delete.vue'
import protocol from './components/protocol.vue'
import { isEmpty } from '@/utils/is'
import { OperateEventEnum, EventEnum, resourceTypeEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData?: any[] // 多选
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

const showVariation = computed(() => props.type === OperateEventEnum.variation)
const showExpand = computed(() => props.type === OperateEventEnum.expand)
const showAdjustNetwork = computed(() => props.type === OperateEventEnum.adjust)
const showUnsubscribe = computed(
  () => props.type === OperateEventEnum.unsubscribe
)
const showRenew = computed(() => props.type === OperateEventEnum.renew)
const showReboot = computed(() => props.type === OperateEventEnum.reboot)
const showPowerOn = computed(() => props.type === OperateEventEnum.powerOn)
const showShutdown = computed(() => props.type === OperateEventEnum.shutdown)
const showHangUp = computed(() => props.type === OperateEventEnum.hangUp)
const showRecover = computed(() => props.type === OperateEventEnum.recover)
const showResetPwd = computed(() => props.type === OperateEventEnum.reset)
const showDelete = computed(() => props.type === OperateEventEnum.delete)
const showAssociateTag = computed(
  () => props.type === OperateEventEnum.associate
)
const showUnbindTag = computed(() => props.type === 'unbindTag') //解绑标签
const showProtocol = computed(() => props.type === 'protocol')
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
  initSelectData()
  initDialog()
})
const selectArray = ref<any[]>([])
const initSelectData = () => {
  if (!showReboot.value && !showPowerOn.value && !showShutdown.value) {
    return
  }
  selectArray.value = [props.rowData]
  // rowData空值则是多选
  if (isEmpty(props.rowData)) {
    selectArray.value = props.selectData
  }
}
const initDialog = () => {
  if (showVariation.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '变配操作'
  } else if (showExpand.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '扩容云硬盘'
  } else if (showAdjustNetwork.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '调整网络'
  } else if (showUnsubscribe.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '退订操作'
  } else if (showRenew.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '续订操作'
  } else if (showReboot.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '重启'
  } else if (showPowerOn.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '开机'
  } else if (showShutdown.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '关机'
  } else if (showHangUp.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '挂起'
  } else if (showRecover.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '恢复'
  } else if (showResetPwd.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '重置密码'
  } else if (showDelete.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '删除'
  } else if (showAssociateTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '标签管理'
  } else if (showUnbindTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '批量解绑标签'
  } else if (showProtocol.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '镜像免责声明'
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
