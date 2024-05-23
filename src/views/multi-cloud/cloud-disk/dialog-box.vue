<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <backup-create
      v-if="showBackup"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <snapshot-create
      v-else-if="showSnapShoot"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <mirror-create
      v-else-if="showMirror"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <event-tip
      v-else-if="showEventTip"
      :type-str="type"
      :select-data="selectData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <mount
      v-else-if="showMount"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <uninstall
      v-else-if="showUninstall"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <unsubscribe
      v-else-if="showUnsubscribe"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-associate-tag
      v-else-if="showAssociateTag"
      :row-data="rowData"
      :resource-type-code="resourceTypeEnum.EBS"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-unbind-tag
      v-else-if="showUnbindTag"
      :resource-type-code="resourceTypeEnum.EBS"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <renew
      v-else-if="showRenew"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>
  </el-dialog>
</template>

<script setup lang="ts">
import backupCreate from './components/backup-create.vue'
import snapshotCreate from './components/snapshot-create.vue'
import mirrorCreate from './components/mirror-create.vue'
import eventTip from './components/event-tip.vue'
import mount from './components/mount.vue'
import uninstall from './components/uninstall.vue'
import unsubscribe from './components/unsubscribe.vue'
import renew from './components/renew.vue'
import { EventEnum, OperateEventEnum, resourceTypeEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData?: any[] // 多选数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: '',
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
// 备份创建 且type没有传枚举值
const showBackup = computed(() => props.type === 'backup')
// 快照创建
const showSnapShoot = computed(() => props.type === 'snapShoot')
// 镜像创建
const showMirror = computed(() => props.type === 'mirror')
// 开通自动续费 修改自动续费 即时转按需 到期转按需
const showEventTip = computed(
  () =>
    props.type === 'openAutoRenew' ||
    props.type === 'changeAutoRenew' ||
    props.type === 'IMToOnDemand' ||
    props.type === 'expireToOnDemand'
)
// 挂载
const showMount = computed(() => props.type === OperateEventEnum.mount)
// 卸载
const showUninstall = computed(() => props.type === OperateEventEnum.uninstall)
const showUnsubscribe = computed(
  () => props.type === OperateEventEnum.unsubscribe
)
const showAssociateTag = computed(
  () => props.type === OperateEventEnum.associate
) //绑定标签
const showUnbindTag = computed(() => props.type === 'unbindTag') //解绑标签
const showResourcePool = computed(() => props.type === 'resourcePool')
const showRenew = computed(() => props.type === OperateEventEnum.renew)
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
  if (showBackup.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '选择备份'
  } else if (showSnapShoot.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '选择快照'
  } else if (showMirror.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '选择镜像'
  } else if (showEventTip.value) {
    dialogWidth.value = '50%'
    if (props.type === 'openAutoRenew') {
      dialogTitle.value = '开通自动续费'
    } else if (props.type === 'changeAutoRenew') {
      dialogTitle.value = '修改自动续费'
    } else if (props.type === 'IMToOnDemand') {
      dialogTitle.value = '即时转按需'
    } else if (props.type === 'expireToOnDemand') {
      dialogTitle.value = '到期转按需'
    }
  } else if (showMount.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '挂载磁盘'
  } else if (showUninstall.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '卸载磁盘'
  } else if (showUnsubscribe.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '退订磁盘'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showAssociateTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '标签管理'
  } else if (showUnbindTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '批量解绑标签'
  } else if (showRenew.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '续订'
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
