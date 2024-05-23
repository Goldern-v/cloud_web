<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create-assist-nic
      v-if="showCreate"
      :detail-info="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create-assist-nic>

    <create-main-nic
      v-if="showCreate && mainCard"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create-main-nic>

    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <change-safe-group
      v-else-if="showChangeSafeGroup"
      :row-data="rowData"
      :nic-type="nicType"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </change-safe-group>

    <bind-eip
      v-else-if="showBindEip"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </bind-eip>

    <unbind-eip
      v-else-if="showUnbindEip"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </unbind-eip>

    <delete-assist-nic
      v-else-if="showDeleteAssistNic"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </delete-assist-nic>

    <delete-main-nic
      v-else-if="showDeleteMainNic"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </delete-main-nic>
  </el-dialog>
</template>

<script setup lang="ts">
import createAssistNic from './assist/create.vue'
import createMainNic from './main/create.vue'
import bindEip from './operate/bind-eip.vue'
import unbindEip from './operate/unbind-eip.vue'
import deleteAssistNic from './operate/delete-assist-nic.vue'
import deleteMainNic from './operate/delete-main-card.vue'
import changeSafeGroup from './operate/change-safe-group.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  nicType?: string //网卡类型  MAIN_CARD  主网卡,EXTEND_CARD  扩展网卡,BACKUP_CARD 辅助网卡
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  nicType: ''
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const mainCard = computed(() => props.nicType === 'MAIN_CARD') //是否主网卡
const assistCard = computed(() => props.nicType === 'BACKUP_CARD') //是否辅助网卡
// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')

const showCreate = computed(() => props.type === OperateEventEnum.create)
const showEdit = computed(() => props.type === OperateEventEnum.edit)

const showResourcePool = computed(() => props.type === 'resourcePool') //创建页面资源池选择
const showBindEip = computed(() => props.type === OperateEventEnum.bind) //绑定eip
const showUnbindEip = computed(() => props.type === OperateEventEnum.unbind) //解绑eip
const showDeleteAssistNic = computed(() => props.type === 'delete-assist-nic') //删除辅助弹性网卡
const showDeleteMainNic = computed(() => props.type === 'delete-main-nic') //删除主弹性网卡
const showChangeSafeGroup = computed(
  () => props.type === OperateEventEnum.change
) //更换安全组

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 类型变化,
watch(
  () => props.type,
  val => {
    initDialog()
  }
)
onMounted(() => {
  initDialog()
})
const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '创建辅助弹性网卡'
  } else if (showEdit.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '修改对等连接'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showBindEip.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '绑定弹性公网IP'
  } else if (showUnbindEip.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = ''
  } else if (showDeleteAssistNic.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '删除辅助弹性网卡'
  } else if (showDeleteMainNic.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '删除弹性网卡'
  } else if (showChangeSafeGroup.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '更换安全组'
  }
}

// 弹框取消
const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 弹框成功提交
const clickSuccessEvent = () => {
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
