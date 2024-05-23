<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create
      v-if="showCreate"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create>

    <add-rule
      v-else-if="showAddRule || showSetRule"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-rule>

    <associated-subnet
      v-else-if="showAssociated"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </associated-subnet>
    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './components/create.vue'
import addRule from './components/add-rule.vue'
import associatedSubnet from './components/associated-subnet.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})
const dialogVisible = ref(true) // 是否显示弹框

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

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
const showAddRule = computed(() => props.type === 'addRule')
const showSetRule = computed(() => props.type === 'setRule')
const showAssociated = computed(() => props.type === OperateEventEnum.associate)
const showResourcePool = computed(() => props.type === 'resourcePool')

const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '创建网络ACL'
  } else if (showAddRule.value) {
    dialogWidth.value = '75%'
    dialogTitle.value = '添加规则'
  } else if (showSetRule.value) {
    dialogWidth.value = '75%'
    dialogTitle.value = '配置规则'
  } else if (showAssociated.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '关联子网'
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
  // dialogVisible.value = false
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
