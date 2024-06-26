<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create-view
      v-if="showCreate"
      :detail-info="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></create-view>

    <associated-subnet
      v-else-if="showAssociatedSubnet"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </associated-subnet>

    <copy-route-table
      v-else-if="showCopyRouteTable"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></copy-route-table>

    <ideal-resource-pool
      v-else-if="showResourcePool"
      type="resourceCenter"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ip-address
      v-else-if="showDefaultIp"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </ip-address>

    <delete-route-table
      v-else-if="showDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </delete-route-table>

    <replace-route-table
      v-else-if="showReplaceRouteTable"
      :row-data="rowData"
      :custom-route="customRoute"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </replace-route-table>

    <add-route
      v-if="showAdd || showEdit"
      :detail-info="detailInfo"
      :row-data="rowData"
      :default-router-list="defaultRouterList"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-route>

    <delete-route
      v-else-if="showDeleteRoute"
      :table-array="tableArray"
      :detail-info="detailInfo"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </delete-route>
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import createView from './create.vue'
import associatedSubnet from './associated-subnet.vue'
import copyRouteTable from './copy-route-table.vue'
import replaceRouteTable from '@/views/multi-cloud/subnet/replace-route-table.vue'
import addRoute from './components/add-route.vue'
import ipAddress from './components/ip-address.vue'
import deleteRouteTable from './delete.vue'
import deleteRoute from './components/delete-route.vue'
import { useResourcePool } from '@/utils/common/resource'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  detailInfo?: any // 详细信息
  rowData?: any // 行数据
  multipleSelection?: any[] //多选数据
  defaultRouterList?: any[] //默认路由
  customRoute?: any //当前路由表的自定义路由
}
const props = withDefaults(defineProps<DialogProps>(), {
  detailInfo: null,
  rowData: null,
  defaultRouterList: () => [],
  multipleSelection: () => [],
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
const showCreate = computed(() => props.type === OperateEventEnum.create) //创建路由表
const showAdd = computed(() => props.type === OperateEventEnum.add) //添加路由
const showEdit = computed(() => props.type === OperateEventEnum.edit) //编辑路由
const showAssociatedSubnet = computed(
  () => props.type === OperateEventEnum.associate
)
const showCopyRouteTable = computed(() => props.type === OperateEventEnum.copy)
const showDefaultIp = computed(() => props.type === 'ipAddress')

const showDelete = computed(() => props.type === OperateEventEnum.delete) //删除路由表
const showReplaceRouteTable = computed(
  () => props.type === OperateEventEnum.replace
) //更换路由表
const showDeleteRoute = computed(
  () => props.type === 'deleteRoute' || props.type === 'batchDeleteRoute'
) //删除路由表中路由

const showOpenIpv6 = computed(() => props.type === 'openIpv6') //开启ipv6
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

const tableArray = ref<any[]>([])
onMounted(() => {
  if (showDeleteRoute.value) {
    console.log(props.multipleSelection, '---')

    tableArray.value =
      props.type === 'deleteRoute' ? [props.rowData] : props.multipleSelection
    console.log(tableArray.value, '====')
  }
  initDialog()
})

// 阿里公有云、天翼云不支持同步创建路由
const { isAliyun, isCtyun } = useResourcePool()
const initDialog = () => {
  if (showCreate.value) {
    // dialogWidth.value = isAliyun.value || isCtyun.value ? '35%' : '60%'
    dialogWidth.value = '60%'
    dialogTitle.value = '创建路由表'
  } else if (showAssociatedSubnet.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = '关联子网'
  } else if (showCopyRouteTable.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '复制路由表'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showAdd.value || showEdit.value) {
    dialogWidth.value = '55%'
    dialogTitle.value = showAdd.value ? '添加路由' : '修改路由'
  } else if (showDefaultIp.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = 'IP地址'
  } else if (showDelete.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '删除路由表'
  } else if (showDeleteRoute.value) {
    dialogWidth.value = '30%'
  } else if (showReplaceRouteTable.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '更换路由表'
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
