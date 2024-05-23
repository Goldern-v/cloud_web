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
    <create
      v-else-if="showCreate"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <delete-view
      v-else-if="showDelete"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <delete-config
      v-else-if="showDeleteConfig"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import create from './components/create.vue'
import deleteView from './components/delete.vue'
import deleteConfig from './components/delete-config.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
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

const showResourcePool = computed(() => props.type === 'resourcePool') //创建页面资源池选择

const showCreate = computed(() => props.type === OperateEventEnum.create) // 绑定
const showDelete = computed(() => props.type === OperateEventEnum.delete) // 删除
const showDeleteConfig = computed(() => props.type === 'deleteConfig')
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
  },
)

onMounted(() => {
  initDialog()
})

const initDialog = () => {
  if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showCreate.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '新建快照'
  } else if (showDelete.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '删除快照'
  } else if (showDeleteConfig.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '删除策略配置'
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
