<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <add-eip
      v-if="showAddEip"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <remove-eip
      v-else-if="showRemoveEip"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <renew
      v-else-if="showRenew"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <replace
      v-else-if="showReplace"
      :select-data="selectArray"
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
import addEip from './components/add-eip.vue'
import removeEip from './components/remove-eip.vue'
import renew from './components/renew.vue'
import replace from './components/replace.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectData?: any[]
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  selectData: () => []
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

const showAddEip = computed(() => props.type === 'addEip')
const showRemoveEip = computed(() => props.type === 'removeEip')
const showRenew = computed(() => props.type === OperateEventEnum.renew)
const showReplace = computed(() => props.type === OperateEventEnum.replace)
const showResourcePool = computed(() => props.type === 'resourcePool')

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
// 多选数据
const selectArray = ref<any[]>([])

onMounted(() => {
  if (showReplace) {
    // rowData有值则是点击行数据操作,否则就是多选
    if (props.rowData) {
      selectArray.value = [props.rowData]
    } else {
      selectArray.value = props.selectData
    }
  }
  initDialog()
})
const initDialog = () => {
  if (showAddEip.value) {
    dialogWidth.value = '65%'
    dialogTitle.value = '添加弹性IP'
  } else if (showRemoveEip.value) {
    dialogWidth.value = '65%'
    dialogTitle.value = '移出弹性IP'
  } else if (showRenew.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '续订'
  } else if (showReplace.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '转包年包月'
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
