<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <bind
      v-if="showBind"
      :detail="detail"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>

    <unbind
      v-if="showUnbind"
      :detail="detail"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>  

    <add-safe-group
      v-if="showAdd"
      :type="type"
      :detail="detail"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"/>
  </el-dialog>
</template>

<script setup lang="ts">
import bind from './bind.vue'
import unbind from './unbind.vue'
import addSafeGroup from './add-safe-group.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  detail?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  detail: () => ({})
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

const showBind = computed(() => props.type === OperateEventEnum.bind)
const showUnbind = computed(() => props.type === OperateEventEnum.unbind)
const showAdd = computed(() => props.type === 'changeSafeGroup' || props.type === 'addSafeGroup' || props.type === 'removeSafeGroup')
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
  if (showBind.value) {
    dialogWidth.value = '65%'
    dialogTitle.value = '绑定弹性网卡'
  } else if (showUnbind.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '解绑弹性网卡'
  } else if (showAdd.value) {
    dialogWidth.value = '45%'
    if (props.type === 'changeSafeGroup') {
      dialogTitle.value = '更改安全组'
    } else if (props.type === 'addSafeGroup') {
      dialogTitle.value = '加入安全组'
    } else if (props.type === 'removeSafeGroup') {
      dialogTitle.value = '移出安全组'
    }
    
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
