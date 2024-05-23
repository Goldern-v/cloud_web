<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <bucket-policy-tip
      v-if="showTip"
      :type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <change
      v-else-if="showChange"
      :type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <copy-bucket
      v-else-if="showCopy"
      :type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import bucketPolicyTip from './components/bucket-policy-tip.vue'
import change from './components/change.vue'
import copyBucket from './components/copy-bucket.vue'
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
  (e: EventEnum.refresh, v: string[]): void // 表单成功提交后刷新列表/（或设置监控项）
}
const emit = defineEmits<EventEmits>()

// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('40%')

const showTip = computed(
  () => props.type === 'read' || props.type === 'readWrite'
) // 绑定
const showChange = computed(() => props.type === OperateEventEnum.change)
const showCopy = computed(() => props.type === OperateEventEnum.copy)
const showResourcePool = computed(() => props.type === 'resourcePool')
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
  if (showTip.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '提示'
  } else if (showChange.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '修改存储类别'
  } else if (showCopy.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '选择复制源'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  }
}

// 弹框取消
const clickCancelEvent = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 弹框成功提交
const clickSuccessEvent = (tags: any) => {
  dialogVisible.value = false
  emit(EventEnum.refresh, tags)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
