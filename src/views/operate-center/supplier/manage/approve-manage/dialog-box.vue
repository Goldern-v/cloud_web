<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <template v-if="showPass || showReject">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item label="理由描述" prop="approvalDesc">
          <el-input
            v-model.trim="form.approvalDesc"
            type="textarea"
            placeholder="请输入"
            :autosize="{ minRows: 3 }"
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
import { ElMessage } from 'element-plus/es'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import {
  supplierPaendApprovePass,
  supplierPaendApproveReject,
  supplierPaendApproveAllPass,
  supplierPaendApproveAllReject
} from '@/api/java/operate-center'

const { t } = useI18n()

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined | string | object // 操作按钮类型
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const form = reactive({
  approvalDesc: ''
})
const rules = reactive<FormRules>({
  approvalDesc: { required: true, message: '请输入理由', trigger: 'blur' }
})
// 弹框
const dialogTitle = ref('')
const dialogVisible = ref(true)
const dialogWidth = ref('30%')

const showPass = computed(
  () => props.type === 'pass' || props.type === 'passAll'
) //通过
const showReject = computed(
  () => props.type === 'reject' || props.type === 'rejectAll'
) //拒绝

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
//取消
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  dialogVisible.value = false
  emit(EventEnum.close)
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const apiType: any = ref()
  // 匹配不同接口
  switch (props.type) {
    case 'pass':
      apiType.value = supplierPaendApprovePass
      break
    case 'reject':
      apiType.value = supplierPaendApproveReject
      break
    case 'passAll':
      apiType.value = supplierPaendApproveAllPass
      break
    default:
      apiType.value = supplierPaendApproveAllReject
      break
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    const params: any = ref({})
    if (props.type == 'pass' || props.type == 'reject') {
      // 单个请求
      params.value = {
        id: props.rowData?.id,
        approvalDesc: form.approvalDesc
      }
    } else {
      // 批量接口
      if (props.rowData?.length > 0) {
        const approvalList: any = ref([])
        props.rowData.forEach((item: any) => {
          approvalList.value.push({ id: item, approvalDesc: form.approvalDesc })
        })
        params.value = {
          approvalList: approvalList.value
        }
      }
    }
    apiType.value(params.value).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success(data || '操作成功')
        emit(EventEnum.refresh)
      } else {
        ElMessage.error('操作失败')
      }
    })
  })
}

// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
</script>
