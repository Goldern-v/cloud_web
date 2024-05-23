<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <add-server
      v-if="showAddServer"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-server>

    <add-across-vpc
      v-if="showAddAcrossVpc"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-across-vpc>

    <add-elastic-net-card
      v-if="showAddElasticNetCard"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-elastic-net-card>
    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import addServer from './components/back-end-server/add-server.vue'
import addAcrossVpc from './components/back-end-server/add-across-vpc.vue'
import addElasticNetCard from './components/back-end-server/add-elastic-net-card.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  selectMonitorIndicator?: string[] //已经选中的监控指标
  multipleSelection?: any[] //多选
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  selectMonitorIndicator: () => [],
  multipleSelection: () => []
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

const showAddServer = computed(() => props.type === 'addCloudServer') //添加服务器
const showAddAcrossVpc = computed(() => props.type === 'addAcrossVpc') //添加跨VPC后端
const showAddElasticNetCard = computed(() => props.type === 'addElasticNetCard') //添加弹性网卡
const showResourcePool = computed(() => props.type === 'resourcePool') //资源池类型

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
  if (showAddServer.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '添加后端服务器组'
  } else if (showAddAcrossVpc.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '添加跨VPC后端'
  } else if (showAddElasticNetCard.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '添加辅助弹性网卡'
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
