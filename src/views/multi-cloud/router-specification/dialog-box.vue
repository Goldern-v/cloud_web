<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <ideal-resource-pool
      v-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <set-share-mode
      v-if="showSetShareMode"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <edit
      v-if="showEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <handle-delete
      v-if="showDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <select-router-mirror
      v-if="showSelectRouterImage"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum, resourceTypeEnum } from '@/utils/enum'
import setShareMode from './operate/set-share-mode.vue'
import edit from './operate/edit.vue'
import handleDelete from './operate/delete.vue'
import selectRouterMirror from './components/select-router-mirror.vue'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined | string // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
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

const showResourcePool = computed(() => props.type === 'resourcePool') //创建页面资源池选择
const showSelectRouterImage = computed(() => props.type === 'selectRouterImage') //选择二层网络
const showSetShareMode = computed(() => props.type === 'setShareMode') //设置共享模式
const showEdit = computed(() => props.type === OperateEventEnum.edit) //编辑
const showDelete = computed(() => props.type === OperateEventEnum.delete) //删除

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
  if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showSelectRouterImage.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '选择路由器镜像'
  } else if (showSetShareMode.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '设置共享模式'
  } else if (showEdit.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '编辑'
  } else if (showDelete.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '删除'
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

<style scoped lang="scss"></style>
