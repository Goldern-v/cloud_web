<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create
      v-if="showCreate || showEdit"
      :row-data="rowData"
      :type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create>
    
    <add-user
      v-else-if="showAddUser"
      :id="rowData?.id"
      :code="rowData?.code"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent">
    </add-user>

    <relate-role
      v-else-if="showRelateRole"
      :row-data="rowData"
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

onMounted(() => {
  initDialog()
})
// 类型变化,
watch(
  () => props.type,
  () => {
    initDialog()
  }
)
// 弹框
const dialogTitle = ref('')
const dialogWidth = ref('30%')
const dialogVisible = ref(true) 

const showCreate = computed(() => props.type === OperateEventEnum.create)
const showEdit = computed(() => props.type === OperateEventEnum.edit)
const showAddUser = computed(() => props.type === 'addUser')
const showRelateRole = computed(() => props.type === 'relate-role')
// 方法
interface EmitEvent {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EmitEvent>()
// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '新建用户'
  } else if (showEdit.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '编辑用户'
  } else if (showAddUser.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '添加用户'
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
