<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <bind
      v-if="showBind"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </bind>

    <unbind
      v-else-if="showUnbind || showBatchUnbind"
      :row-data="rowData"
      :multiple-selection="multipleSelection"
      :dialog-type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></unbind>

    <release
      v-else-if="showRelease"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </release>

    <shift-out-shared-bandwidth
      v-else-if="showShiftOut"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </shift-out-shared-bandwidth>

    <shift-in-shared-bandwidth
      v-else-if="showShiftIn"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </shift-in-shared-bandwidth>

    <ipv6
      v-else-if="showIpv6Switch"
      :row-data="rowData"
      :dialog-type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </ipv6>

    <edit-bandwidth-dialog
      v-else-if="showEditBandwidth"
      :multiple-selection="multipleSelection"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </edit-bandwidth-dialog>

    <unsubscribe
      v-else-if="showUnsubscribe"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </unsubscribe>

    <set-monitor-indicator
      v-else-if="setMonitor"
      :select-monitor-indicator="selectMonitorIndicator"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></set-monitor-indicator>

    <add-tag
      v-else-if="addSingleTag"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-tag>

    <ideal-associate-tag
      v-else-if="showAssociateTag"
      :resource-type-code="resourceTypeEnum.EIP"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </ideal-associate-tag>

    <ideal-unbind-tag
      v-else-if="showUnbindTag"
      :resource-type-code="resourceTypeEnum.EIP"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </ideal-unbind-tag>

    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import bind from './operate/bind.vue'
import unbind from './operate/unbind.vue'
import release from './operate/release.vue'
import shiftOutSharedBandwidth from './operate/shift-out-shared-bandwidth.vue'
import shiftInSharedBandwidth from './operate/shift-in-shared-bandwidth.vue'
import ipv6 from './operate/ipv6.vue'
import editBandwidthDialog from './operate/edit-bandwidth-dialog.vue'
import renew from './operate/renew.vue'
import unsubscribe from './operate/unsubscribe.vue'
import setMonitorIndicator from './detail/set-monitor-Indicator.vue'
import addTag from './detail/add-tag.vue'
import { OperateEventEnum, EventEnum, resourceTypeEnum } from '@/utils/enum'

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
  (e: EventEnum.refresh, v: string[]): void // 表单成功提交后刷新列表/（或设置监控项）
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showResourcePool = computed(() => props.type === 'resourcePool') //创建页面资源池选择

const showBind = computed(() => props.type === OperateEventEnum.bind) // 绑定

const showUnbind = computed(() => props.type === OperateEventEnum.unbind) // 解绑
const showBatchUnbind = computed(
  () => props.type === OperateEventEnum.batch + OperateEventEnum.unbind
) // 批量解绑

const showShiftOut = computed(() => props.type === OperateEventEnum.shiftOut) // 移出共享带宽
const showShiftIn = computed(() => props.type === OperateEventEnum.shiftIn) // 移入共享带宽

const showRelease = computed(() => props.type === OperateEventEnum.release) // 释放
const showBatchRelease = computed(
  () => props.type === OperateEventEnum.batch + OperateEventEnum.release
) //批量释放

//Ipv6转换
const showIpv6Switch = computed(
  () =>
    props.type === OperateEventEnum.closeIpv6 ||
    props.type === OperateEventEnum.openIpv6
)

const setMonitor = computed(() => props.type === OperateEventEnum.monitor) //设置监控指标

const addSingleTag = computed(() => props.type === OperateEventEnum.add) //添加标签

const showEditBandwidth = computed(() => props.type === OperateEventEnum.edit) //批量修改带宽

const showUnsubscribe = computed(
  () => props.type === OperateEventEnum.unsubscribe
) //退订

const showAssociateTag = computed(
  () => props.type === OperateEventEnum.associate
) //关联标签

const showUnbindTag = computed(() => props.type === 'unbindTag') //解绑标签

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// // 类型变化,
// watch(
//   () => props.type,
//   value => {
//     initDialog()
//   },
// )

onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showBind.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '绑定弹性公网IP'
  } else if (showUnbind.value || showBatchUnbind.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '解绑'
  } else if (showRelease.value || showBatchRelease.value) {
    dialogWidth.value = '40%'
  } else if (showShiftOut.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '移出共享带宽'
  } else if (showShiftIn.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '加入共享带宽'
  } else if (setMonitor.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '设置监控指标'
  } else if (showIpv6Switch.value) {
    dialogWidth.value = '40%'
    dialogTitle.value =
      props.type === OperateEventEnum.openIpv6 ? '开启IPv6转换' : '关闭IPv6转换'
  } else if (showEditBandwidth.value) {
    dialogWidth.value = '40%'
  } else if (showAssociateTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '标签管理'
  } else if (showUnbindTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '批量解绑标签'
  } else if (showUnsubscribe.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '退订弹性IP'
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
const clickSuccessEvent = (tags: any) => {
  dialogVisible.value = false
  emit(EventEnum.refresh, tags)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
