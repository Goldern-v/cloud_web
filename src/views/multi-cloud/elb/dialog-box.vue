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
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </bind>

    <unbind
      v-else-if="showUnbind"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </unbind>

    <out-of-service
      v-else-if="showClose"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </out-of-service>

    <handle-delete
      v-else-if="showDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </handle-delete>

    <unsubscribe
      v-else-if="showUnsubscribe"
      :multiple-selection="multipleSelection"
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

    <config-access-log
      v-else-if="configLog"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </config-access-log>

    <add-server
      v-else-if="showAddServer"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-server>
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
import outOfService from './operate/out-of-service.vue'
import handleDelete from './operate/delete.vue'
import unsubscribe from './operate/unsubscribe.vue'
import setMonitorIndicator from './detail/set-monitor-Indicator.vue'
import configAccessLog from './detail/config-access-log.vue'
import addServer from './operate/add-listener/add-server.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

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

const setMonitor = computed(() => props.type === OperateEventEnum.monitor) //设置监控指标

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')

const showBind = computed(() => props.type === OperateEventEnum.bind) //绑定ipv4公网IP
const showUnbind = computed(() => props.type === OperateEventEnum.unbind) //解绑ipv4公网IP
const showClose = computed(() => props.type === OperateEventEnum.close) //负载均衡停用
const showDelete = computed(() => props.type === OperateEventEnum.delete) //删除负载均衡
const showUnsubscribe = computed(
  () => props.type === OperateEventEnum.unsubscribe
) //退订负载均衡
const showAddServer = computed(() => props.type === OperateEventEnum.add) //添加服务器
const configLog = computed(() => props.type === OperateEventEnum.config) //配置日志
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
  if (showBind.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '绑定IPv4公网IP'
  } else if (showUnbind.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '解绑IPv4公网IP'
  } else if (showClose.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '停用'
  } else if (showDelete.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '删除'
  } else if (showUnsubscribe.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '退订'
  } else if (setMonitor.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '设置监控指标'
  } else if (configLog.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '配置访问日志'
  } else if (showAddServer.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '添加后端服务器组'
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
