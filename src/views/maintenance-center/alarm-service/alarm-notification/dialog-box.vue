<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <!-- 创建/编辑联系人  -->
    <create-contact-person
      v-if="showCreate || showEdit"
      :row-data="rowData"
      :type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create-contact-person>

    <!-- 添加到联系组  -->
    <add-to-contact-group
      v-if="showAddToContactGroup"
      :multi-contact-person="multiContactPerson"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-to-contact-group>

    <!-- 创建/编辑联系组  -->
    <create-contact-group
      v-if="showCreateContactGroup || showEditContactGroup"
      :row-data="rowData"
      :type="type"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </create-contact-group>

    <!-- 添加联系人 -->
    <add-contact-person
      v-if="showAddToContactPerson"
      :row-data="rowData"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    >
    </add-contact-person>
  </el-dialog>
</template>

<script setup lang="ts">
import createContactPerson from './contact-person/create-contact-person.vue'
import addToContactGroup from './contact-person/add-to-contact-group.vue'
import createContactGroup from './contact-group/create-contact-group.vue'
import addContactPerson from './contact-group/add-contact-person.vue'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined | string
  rowData?: any // 行数据
  isEdit?: boolean //显示创建或编辑
  multiContactPerson?: string[]
}
const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  rowData: null,
  isEdit: false,
  multiContactPerson: () => []
})

const isEdit = computed(() => props.type === OperateEventEnum.edit) //是否编辑页面

/**
 * 联系人
 */
const showCreate = computed(() => props.type === OperateEventEnum.create) //是否创建联系人
const showDelete = computed(() => props.type === OperateEventEnum.delete) //是否批量删除联系人
const showEdit = computed(() => props.type === OperateEventEnum.edit) //是否编辑联系人
const showAddToContactPerson = computed(
  () => props.type === OperateEventEnum.add
) //是否添加联系人

/**
 * 联系组
 */
//是否添加到联系组
const showAddToContactGroup = computed(() => props.type === 'addToContactGroup')
//是否创建联系组
const showCreateContactGroup = computed(
  () => props.type === 'createContactGroup'
)

//是否编辑联系组
const showEditContactGroup = computed(() => props.type === 'editContactGroup')

/**
 * 弹框
 */
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')
// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
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
  if (isEdit.value) {
    dialogTitle.value = '编辑联系人'
  } else if (showCreate.value) {
    dialogTitle.value = '创建联系人'
  } else if (showDelete.value) {
    dialogTitle.value = '批量删除联系人'
  } else if (showAddToContactPerson.value) {
    dialogTitle.value = '添加联系人'
    dialogWidth.value = '45%'
  } else if (showCreateContactGroup.value) {
    dialogTitle.value = '创建联系组'
  } else if (showAddToContactGroup.value) {
    dialogTitle.value = '添加到联系组'
  } else if (showEditContactGroup.value) {
    dialogTitle.value = '编辑联系组'
  }
}
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 100%;
}
</style>
