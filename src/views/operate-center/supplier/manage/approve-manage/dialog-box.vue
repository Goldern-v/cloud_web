<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <template v-if="showPass || showReject">
      <el-form ref="formRef" :model="form" label-position="left">
        <el-form-item label="理由描述" prop="vpcName">
          <el-input
            v-model.trim="form.remark"
            type="textarea"
            :autosize="{ minRows: 3 }"
            placeholder="请输入"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <div class="flex-row ideal-submit-button">
        <el-button type="info" @click="cancelForm(formRef)">{{
          t('cancel')
        }}</el-button>
        <el-button type="primary" @click="submitForm(formRef)">{{
          t('confirm')
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import type { FormInstance } from 'element-plus'

const { t } = useI18n()

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined | string // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const form = {
  remark: ''
}
// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')

const showPass = computed(() => props.type === 'pass') //通过
const showReject = computed(() => props.type === 'reject') //拒绝

onMounted(() => {
  initDialog()
})

const initDialog = () => {
  dialogWidth.value = '30%'
  if (showPass.value) {
    dialogTitle.value = '通过'
  } else if (showReject.value) {
    dialogTitle.value = '驳回'
  }
}

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const formRef = ref<FormInstance>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  dialogVisible.value = false
  emit(EventEnum.close)
}

const submitForm = (formEl: FormInstance | undefined) => {}

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
</script>

<style scoped lang="scss"></style>
