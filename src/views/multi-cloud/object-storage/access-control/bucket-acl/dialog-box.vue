<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <public-read-write
      v-if="showReadWrite"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <public-read
      v-else-if="showRead"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-account-auth
      v-else-if="showAdd"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import publicReadWrite from './components/public-read-write.vue'
import publicRead from './components/public-read.vue'
import addAccountAuth from './components/add-account-auth.vue'
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
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showReadWrite = computed(() => props.type === 'publicReadWrite')
const showRead = computed(() => props.type === 'publicRead')
const showAdd = computed(() => props.type === OperateEventEnum.add)

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
  if (showReadWrite.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '确认选择公共读写'
  } else if (showRead.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '确认选择公共读'
  } else if (showAdd.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '新增账号授权'
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
