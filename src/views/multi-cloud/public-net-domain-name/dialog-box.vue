<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <create-domain-name
      v-if="showCreate"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    ></create-domain-name>

    <add-record
      v-if="showAddRecord"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-record>

    <add-analysis
      v-if="showAddAnalysis"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-analysis>

    <pause
      v-if="showPause"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </pause>

    <edit
      v-if="showEdit"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </edit>

    <delete-domain-name
      v-if="showDelete"
      :table-array="tableArray"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </delete-domain-name>
  </el-dialog>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { isEmpty } from '@/utils/is'
import createDomainName from './create.vue'
import addRecord from './manage-analyze/analyze-record/add-record.vue'
import addAnalysis from './manage-analyze/analyze-record/add-analysis.vue'
import pause from './pause.vue'
import edit from './edit.vue'
import deleteDomainName from './delete.vue'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
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

const showCreate = computed(() => props.type === OperateEventEnum.create)
const showChangeNetwork = computed(
  () => props.type === 'editNetwork'
)
const showAddTag = computed(() => props.type === 'addTag') //添加标签

const showAddRecord = computed(() => props.type === OperateEventEnum.add) //添加记录集

const showAddAnalysis = computed(() => props.type === 'addAnalysis') //快速添加解析

const showPause = computed(() => props.type === 'pause') //暂停公网域名

const showDelete = computed(() => props.type === OperateEventEnum.delete) //删除公网域名

const showEdit = computed(() => props.type === OperateEventEnum.edit) //修改公网域名
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

const tableArray: any = ref([])
onMounted(() => {
  if (!isEmpty(props.rowData)) {
    tableArray.value = [props.rowData]
  } else {
    tableArray.value = props.multipleSelection
  }
  initDialog()
})
const initDialog = () => {
  if (showCreate.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '创建公网域名'
  } else if (showChangeNetwork.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '编辑网段'
  } else if (showAddTag.value) {
    dialogWidth.value = '50%'
    dialogTitle.value = '添加标签'
  } else if (showAddRecord.value) {
    dialogWidth.value = '40%'
    dialogTitle.value = '添加记录集'
  } else if (showAddAnalysis.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '快速添加解析'
  } else if (showDelete.value) {
    dialogWidth.value = '35%'
    dialogTitle.value = '删除公网域名'
  } else if (showPause.value) {
    dialogWidth.value = '35%'
  } else if (showEdit.value) {
    dialogWidth.value = '30%'
    dialogTitle.value = '修改公网域名'
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
