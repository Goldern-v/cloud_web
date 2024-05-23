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

    <add-resource
      v-else-if="showAddResource || showEditResource"
      :is-edit="showEditResource"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <enable
      v-else-if="showEnable || showForbidden || showDelete"
      :type="type"
      :select-data="selectData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './create.vue'
import addResource from './add-resource.vue'
import enable from './enable.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined
  rowData?: any // 行数据
  isEdit?: boolean //显示创建或编辑
  selectData?: any[] // 多选
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  rowData: null,
  isEdit: false,
  selectData: () => []
})

const showCreate = computed(() => props.type === OperateEventEnum.create)
const showEdit = computed(() => props.type === OperateEventEnum.edit) //是否编辑页面
const showAddResource = computed(() => props.type === 'addResource')
const showEditResource = computed(() => props.type === 'editResource')
const showEnable = computed(() => props.type === OperateEventEnum.enable)
const showForbidden = computed(() => props.type === OperateEventEnum.forbidden)
const showDelete = computed(() => props.type === OperateEventEnum.delete)
/* 
弹框
 */
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')
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
  if (showEdit.value) {
    dialogTitle.value = '编辑服务配置'
    dialogWidth.value = '40%'
  } else if (showCreate.value) {
    dialogTitle.value = '创建服务配置'
    dialogWidth.value = '40%'
  } else if (showAddResource.value) {
    dialogTitle.value = '配置底层资源'
    dialogWidth.value = '40%'
  } else if (showEditResource.value) {
    dialogTitle.value = '编辑底层资源'
    dialogWidth.value = '40%'
  } else if (showEnable.value) {
    dialogTitle.value = '启用'
    dialogWidth.value = '30%'
  } else if (showForbidden.value) {
    dialogTitle.value = '禁用'
    dialogWidth.value = '30%'
  } else if (showDelete.value) {
    dialogTitle.value = '删除'
    dialogWidth.value = '30%'
  }
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
