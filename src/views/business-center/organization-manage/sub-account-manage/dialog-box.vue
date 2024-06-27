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
      :is-edit="showEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <relate-role
      v-else-if="showRelateRole"
      :associated-role="associatedRole"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <remove-role
      v-else-if="showRemoveRole"
      :remove-role="removeRoles"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <relate-project
      v-else-if="showRelateProject"
      :associated-project="props.associatedProject"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <remove-project
      v-else-if="showRemoveProject"
      :remove-project="removeProjects"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <relate-vdc
      v-else-if="showRelateVdc"
      :associated-vdc="associatedVdc"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <authorized-auth
      v-else-if="showAuthorizedAuth"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './components/create.vue'
import relateRole from './relate-role/relate.vue'
import removeRole from './relate-role/remove.vue'
import relateProject from './relate-project/relate.vue'
import removeProject from './relate-project/remove.vue'
import relateVdc from './relate-vdc/relate.vue'
import authorizedAuth from './authorized/auth.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  multipleSelection?: any[] // 多选数据
  associatedRole?: any[] //已关联的角色
  removeRoles?: any[] //待移除的角色
  associatedProject?: any[] //已关联的项目
  removeProjects?: any[] //待移除的项目
  associatedVdc?: any[] //已关联的vdc
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  multipleSelection: () => [],
  associatedRole: () => [],
  removeRoles: () => [],
  associatedProject: () => [],
  removeProjects: () => [],
  associatedVdc: () => []
})

const dialogVisible = ref(true) // 是否显示弹框
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
const showCreate = computed(() => props.type === OperateEventEnum.create)
const showEdit = computed(() => props.type === OperateEventEnum.edit)
const showRelateRole = computed(() => props.type === 'relate-role')
const showRemoveRole = computed(() => props.type === 'remove-role')
const showRelateProject = computed(() => props.type === 'relate-project')
const showRemoveProject = computed(() => props.type === 'remove-project')
const showRelateVdc = computed(() => props.type === 'relate-vdc')
const showAuthorizedAuth = computed(() => props.type === 'authorized-auth')
const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '创建子用户'
  } else if (showEdit.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '编辑子用户'
  } else if (showRelateRole.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '关联角色'
  } else if (showRemoveRole.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '取消关联角色'
  } else if (showRelateProject.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '关联项目'
  } else if (showRemoveProject.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '取消关联项目'
  } else if (showRelateVdc.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '关联VDC'
  } else if (showAuthorizedAuth.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '授权用户'
  }
}
// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
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
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
