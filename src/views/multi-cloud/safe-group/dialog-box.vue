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
    />

    <handle-delete
      v-if="showHandleDelete"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </handle-delete>

    <add-rule
      v-else-if="showAddRule"
      :direction="direction"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <copy-rule
      v-else-if="showCopyRule"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <edit-rule
      v-else-if="showEditRule"
      :type="type"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <delete-rule
      v-else-if="showDeleteRule"
      :row-data="rowData"
      :dialog-type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <one-key
      v-else-if="showOneKey"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <change
      v-else-if="showChange"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <clone
      v-else-if="showClone"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <edit
      v-else-if="showEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-server
      v-else-if="showAddServer"
      :row-data="rowData"
      :associated-server="associatedServer"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <remove-server
      v-else-if="showUnbindServer"
      :table-array="tableArray"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </remove-server>

    <add-extension
      v-else-if="showAddExtension"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <add-eni
      v-else-if="showAddEni"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-associate-tag
      v-else-if="showAssociateTag"
      :row-data="rowData"
      :resource-type-code="resourceTypeEnum.SECURITY_GROUP"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <ideal-unbind-tag
      v-else-if="showUnbindTag"
      :resource-type-code="resourceTypeEnum.SECURITY_GROUP"
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
import { isEmpty } from '@/utils/is'
import create from './create.vue'
import edit from './edit.vue'
import handleDelete from './delete.vue'
import deleteRule from './components/delete-rule.vue'
import addRule from './components/add-rule.vue'
import copyRule from './components/copy-rule.vue'
import editRule from './components/edit-rule.vue'
import oneKey from './components/one-key.vue'
import change from './components/change.vue'
import clone from './components/clone.vue'
import addServer from './components/add-server.vue'
import addExtension from './components/add-extension.vue'
import addEni from './components/add-eni.vue'
import removeServer from './components/remove-server.vue'
import { OperateEventEnum, EventEnum, resourceTypeEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  multipleSelection?: any //多选数据
  direction?: string // 规则 出入方向
  associatedServer?: any // 规则 出入方向
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  direction: '',
  multipleSelection: () => [],
  associatedServer: () => []
})

const tableArray = ref([])
onMounted(() => {
  if (!isEmpty(props.rowData)) {
    tableArray.value = [props.rowData]
  } else {
    tableArray.value = props.multipleSelection
  }
  initDialog()
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

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}

// 类型变化,
watch(
  () => props.type,
  val => {
    initDialog()
  }
)

const showResourcePool = computed(() => props.type === 'resourcePool') //创建页面资源池选择
const showAssociateTag = computed(
  () => props.type === OperateEventEnum.associate
) //绑定标签
const showUnbindTag = computed(() => props.type === 'unbindTag') //解绑标签
const showCreate = computed(() => props.type === OperateEventEnum.create) //创建安全组
const showEdit = computed(() => props.type === OperateEventEnum.edit)
const showChange = computed(() => props.type === OperateEventEnum.change) //修改安全组
const showHandleDelete = computed(() => props.type === 'handleDelete') //删除安全组
//安全组规则
const showAddRule = computed(() => props.type === 'addRule')
const showCopyRule = computed(() => props.type === 'copyRule')
const showEditRule = computed(() => props.type === 'editRule')
const showDeleteRule = computed(() => props.type === OperateEventEnum.delete) //删除安全组规则
const showOneKey = computed(() => props.type === OperateEventEnum.oneKey)
const showClone = computed(() => props.type === OperateEventEnum.copy)
const showAddServer = computed(() => props.type === 'addServer')
const showUnbindServer = computed(() => props.type === OperateEventEnum.unbind) //解绑云主机
const showAddExtension = computed(() => props.type === 'addExtension')
const showAddEni = computed(() => props.type === 'addSubEni')
const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '创建安全组'
  } else if (showChange.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '修改安全组'
  } else if (showClone.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '克隆安全组'
  } else if (showHandleDelete.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '删除安全组'
  } else if (showAddRule.value) {
    dialogWidth.value = '70%'
    if (props.direction === 'enter') {
      dialogTitle.value = '添加入方向规则'
    } else {
      dialogTitle.value = '添加出方向规则'
    }
  } else if (showCopyRule.value) {
    dialogWidth.value = '70%'
    if (props.direction === 'enter') {
      dialogTitle.value = '复制入方向规则'
    } else {
      dialogTitle.value = '复制出方向规则'
    }
  } else if (showEditRule.value) {
    dialogWidth.value = '70%'
    if (props.direction === 'enter') {
      dialogTitle.value = '修改入方向规则'
    } else {
      dialogTitle.value = '修改出方向规则'
    }
  } else if (showDeleteRule.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '删除安全组规则'
  } else if (showOneKey.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '一键放通'
  } else if (showAddServer.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '添加服务器'
  } else if (showUnbindServer.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '移出服务器'
  } else if (showAddExtension.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '添加扩展网卡'
  } else if (showAddEni.value) {
    dialogWidth.value = '60%'
    dialogTitle.value = '添加辅助弹性网卡'
  } else if (showResourcePool.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '选择资源池'
  } else if (showAssociateTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '标签管理'
  } else if (showUnbindTag.value) {
    dialogWidth.value = '45%'
    dialogTitle.value = '批量解绑标签'
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
