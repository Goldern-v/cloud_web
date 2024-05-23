<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <edit-vpc
      v-if="showEdit"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></edit-vpc>

    <delete-vpc
      v-if="showDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </delete-vpc>

    <change-network
      v-else-if="showChangeNetwork"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></change-network>

    <open-ipv6
      v-else-if="showOpenIpv6"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-tag
      v-else-if="showAddTag"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-tag>

    <ideal-associate-tag
      v-else-if="showAssociateTag"
      :row-data="rowData"
      :resource-type-code="resourceTypeEnum.VPC"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </ideal-associate-tag>

    <ideal-unbind-tag
      v-else-if="showUnbindTag"
      :resource-type-code="resourceTypeEnum.VPC"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </ideal-unbind-tag>

    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum, resourceTypeEnum } from '@/utils/enum'
import editVpc from './edit.vue'
import changeNetwork from './change-network.vue'
import addTag from './detail/add-tag.vue'
import deleteVpc from './delete.vue'
import openIpv6 from '../subnet/components/open-ipv6.vue'

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

const showEdit = computed(() => props.type === OperateEventEnum.edit)

const showChangeNetwork = computed(() => props.type === 'editNetwork')
const showAddTag = computed(() => props.type === 'addTag')

const showDelete = computed(() => props.type === OperateEventEnum.delete)

const showOpenIpv6 = computed(() => props.type === 'openIpv6') //开启ipv6

const showAssociateTag = computed(
  () => props.type === OperateEventEnum.associate
) //关联标签

const showUnbindTag = computed(() => props.type === 'unbindTag') //解绑标签

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
  if (showEdit.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '编辑网段'
  } else if (showDelete.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '删除虚拟私有云'
  } else if (showChangeNetwork.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '编辑网段'
  } else if (showAddTag.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '添加标签'
  } else if (showAssociateTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '标签管理'
  } else if (showUnbindTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '批量解绑标签'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showOpenIpv6.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '开启IPv6'
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
