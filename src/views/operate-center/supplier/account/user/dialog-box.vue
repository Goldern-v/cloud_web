<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <template #header>
      <div v-if="showCustomHeader" class="flex-row" style="align-items: center">
        <svg-icon
          icon="info-warning"
          :color="headerIconColor"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <div class="custom-dialog-title">{{ headerTitle }}</div>
      </div>
    </template>

    <create
      v-if="showCreate"
      :row-data="rowData"
      :is-edit="isEdit"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <change-pwd
      v-else-if="showChange"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <bind-role
      v-else-if="showBindRole"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <div v-else-if="showEnable">
      <div>确定将当前选中用户状态从禁用转为启用吗？</div>
      <div class="flex-row ideal-submit-button">
        <el-button @click="clickCancelEvent">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="clickEnable">{{
          t('confirm')
        }}</el-button>
      </div>
    </div>

    <div v-else-if="showForbidden">
      <div>确定将当前选中用户状态从禁用转为启用吗？</div>
      <div class="flex-row ideal-submit-button">
        <el-button @click="clickCancelEvent">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="clickForbidden">{{
          t('confirm')
        }}</el-button>
      </div>
    </div>

    <div v-else-if="showDelete">
      <div>确定删除所选用户吗？</div>
      <div class="flex-row ideal-submit-button">
        <el-button @click="clickCancelEvent">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="clickDelete">{{
          t('confirm')
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import create from './components/create.vue'
import changePwd from './components/change-pwd.vue'
import bindRole from './components/bind-role.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus/es'
import {
  forbiddenUser,
  enabledUser,
  removeUser
} from '@/api/java/business-center'

const { t } = useI18n()

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

const showCreate = computed(
  () =>
    props.type === OperateEventEnum.create ||
    props.type === OperateEventEnum.edit
)
const isEdit = computed(() => props.type === OperateEventEnum.edit)
const showChange = computed(() => props.type === OperateEventEnum.change)
const showEnable = computed(() => props.type === OperateEventEnum.enable)
const showForbidden = computed(() => props.type === OperateEventEnum.forbidden)
const showDelete = computed(() => props.type === OperateEventEnum.delete)
const showBindRole = computed(() => props.type === 'bind-role')
// 是否自定义对话框标题
const showCustomHeader = computed(
  () => showEnable.value || showForbidden.value || showDelete.value
)
const headerIconColor = computed(() => {
  return 'var(--el-color-primary)'
})
const headerTitle = computed(() => {
  let str = ''
  if (showEnable.value) {
    str = '启用用户'
  } else if (showForbidden.value) {
    str = '禁用用户'
  } else if (showDelete.value) {
    str = '删除用户'
  }
  return str
})
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
    dialogWidth.value = '35%'
    if (isEdit.value) {
      dialogWidth.value = '35%'
      dialogTitle.value = '编辑供应商'
    } else {
      dialogTitle.value = '创建供应商'
    }
  } else if (showChange.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '修改密码'
  } else if (showEnable.value) {
    dialogWidth.value = '20%'
    dialogTitle.value = '启用用户'
  } else if (showForbidden.value) {
    dialogWidth.value = '20%'
    dialogTitle.value = '禁用用户'
  } else if (showBindRole.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '绑定解绑角色'
  }
}
// 弹框
const dialogTitle = ref('')
const dialogWidth = ref('20%')
const dialogVisible = ref(true) // 是否显示弹框

// 方法
interface EmitEvent {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
  (e: 'relateRole', v: any[] | undefined): void
}
const emit = defineEmits<EmitEvent>()

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
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
//关联角色
const selectRole = (v: any[] | undefined) => {
  emit('relateRole', v)
}
// 启用用户
const clickEnable = () => {
  const arr = props.multipleSelection.map(item => item.id)
  enabledUser(arr).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      ElMessage.success({
        message: '启用成功',
        duration: 500,
        onClose: () => {
          emit(EventEnum.refresh)
        }
      })
    } else {
      ElMessage.error('启用失败')
    }
  })
}
// 禁用用户
const clickForbidden = () => {
  const arr = props.multipleSelection.map(item => item.id)
  forbiddenUser(arr).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      ElMessage.success({
        message: '禁用成功',
        duration: 500,
        onClose: () => {
          emit(EventEnum.refresh)
        }
      })
    } else {
      ElMessage.error('禁用失败')
    }
  })
}
// 删除用户
const clickDelete = () => {
  const arr = props.multipleSelection.map(item => item.id)
  removeUser(arr).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      ElMessage.success({
        message: '删除成功',
        duration: 500,
        onClose: () => {
          emit(EventEnum.refresh)
        }
      })
    } else {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<style scoped lang="scss">
.custom-dialog-title {
  font-size: 16px;
  color: #000;
}
</style>
