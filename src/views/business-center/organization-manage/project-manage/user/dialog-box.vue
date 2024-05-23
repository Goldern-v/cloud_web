<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create
      v-if="showCreate"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create>

    <add-user
      v-else-if="showAddUser"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent">
    </add-user>

    <relate-role
      v-else-if="showRelateRole"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent">
    </relate-role>
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import addUser from './add-user.vue'
import relateRole from './relate-role.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})
const dialogVisible = ref(true) // 是否显示弹框

// 方法
interface EmitEvent {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EmitEvent>()

// 弹框
const dialogTitle = ref('')
const dialogWidth = ref('30%')

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

const showCreate = computed(() => props.type === OperateEventEnum.create || props.type === OperateEventEnum.edit)
const isEdit = computed(() => props.type === OperateEventEnum.edit)
const showAddUser = computed(() => props.type === 'addUser')
const showRelateRole = computed(() => props.type === 'relateRole')

const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '新建用户'
  } else if (isEdit.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '编辑用户'
  } else if (showAddUser.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '关联用户'
  } else if (showRelateRole.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '关联角色'
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
