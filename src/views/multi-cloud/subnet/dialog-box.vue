<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create-subnet
      v-if="showCreate"
      :detail-info="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></create-subnet>

    <edit-subnet
      v-else-if="showEdit"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></edit-subnet>

    <delete-subnet
      v-else-if="showDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </delete-subnet>

    <replace-route-table
      v-else-if="showReplaceRouteTable"
      :row-data="rowData"
      :custom-route="customRoute"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </replace-route-table>

    <apply-virtual-ip
      v-else-if="showApplyVirtualIp"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></apply-virtual-ip>

    <add-tag
      v-else-if="showAddTag"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-tag>

    <open-ipv6
      v-else-if="showOpenIpv6"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-associate-tag
      v-else-if="showAssociateTag"
      :row-data="rowData"
      :resource-type-code="resourceTypeEnum.SUBNET"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-unbind-tag
      v-else-if="showUnbindTag"
      :resource-type-code="resourceTypeEnum.SUBNET"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum, resourceTypeEnum } from '@/utils/enum'
import createSubnet from './create.vue'
import editSubnet from './edit.vue'
import deleteSubnet from './delete.vue'
import replaceRouteTable from './replace-route-table.vue'
import applyVirtualIp from './components/apply-virtual-ip.vue'
import addTag from './components/add-tag.vue'
import openIpv6 from './components/open-ipv6.vue'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  customRoute?: any //当前路由表的自定义路由
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  customRoute: () => []
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
const showCreate = computed(() => props.type === OperateEventEnum.create)
const showDelete = computed(() => props.type === OperateEventEnum.delete)
const showApplyVirtualIp = computed(() => props.type === OperateEventEnum.apply)
const showReplaceRouteTable = computed(
  () => props.type === OperateEventEnum.replace
) //更换路由表
const showOpenIpv6 = computed(() => props.type === 'openIpv6') //开启ipv6
const showAddTag = computed(() => props.type === 'addTag')
const showAssociateTag = computed(
  () => props.type === OperateEventEnum.associate
) //绑定标签
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
    dialogTitle.value = '编辑子网'
  } else if (showCreate.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '创建子网'
  } else if (showReplaceRouteTable.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '更换路由表'
  } else if (showApplyVirtualIp.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '申请虚拟IP地址'
  } else if (showAddTag.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '添加标签'
  } else if (showDelete.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '删除子网'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showAssociateTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '标签管理'
  } else if (showUnbindTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '批量解绑标签'
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
  emit(EventEnum.refresh)
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
