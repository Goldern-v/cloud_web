<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <upload-object
      v-if="showUpload"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <create-folder
      v-else-if="showCreate"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <share
      v-else-if="showShare"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <delete-folder
      v-else-if="showDelete"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import uploadObject from './components/upload-object.vue'
import createFolder from './components/create-folder.vue'
import share from './components/share.vue'
import deleteFolder from './components/delete-folder.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表/（或设置监控项）
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showUpload = computed(() => props.type === OperateEventEnum.upload)
const showCreate = computed(() => props.type === OperateEventEnum.create)
const showShare = computed(() => props.type === OperateEventEnum.share)
const showDelete = computed(() => props.type === OperateEventEnum.delete)

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 类型变化,
watch(
  () => props.type,
  value => {
    initDialog()
  }
)

onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showUpload.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '上传对象'
  } else if (showCreate.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '新建文件夹'
  } else if (showShare.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '分享文件夹'
  } else if (showDelete.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '删除文件夹'
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
