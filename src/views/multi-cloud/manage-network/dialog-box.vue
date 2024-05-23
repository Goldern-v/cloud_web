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

    <select-layer2-network
      v-if="showSelectLayer2"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <edit
      v-if="showEdit"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-net-segment
      v-if="showAddNetSegment"
      :detail="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import selectLayer2Network from './operate/select-layer-2-net.vue'
import edit from './operate/edit.vue'
import addNetSegment from './operate/add-net-segment.vue'

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
const showSelectLayer2 = computed(() => props.type === 'selectLayer2') //选择二层网络
const showAddNetSegment = computed(() => props.type === 'addNetSegment') //添加网络段
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
  } else if (showSelectLayer2.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '选择二层网络'
  } else if (showAddNetSegment.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '添加网络段'
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
