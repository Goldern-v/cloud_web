<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="可接受价格" prop="acceptablePrice">
        <el-input
          v-model.number="form.acceptablePrice"
          class="custom-input"
          placeholder="请输入"
        >
        </el-input>
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
  </div>
</template>

<script setup lang="ts">
import { supplierWokkorderRejected } from '@/api/java/operate-center'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
const formRef = ref<FormInstance>()
import { hideLoading, showLoading } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
const { t } = useI18n()
const form: { [key: string]: any } = reactive({
  acceptablePrice: '' // 线路编号
})

const rules = reactive<FormRules>({
  acceptablePrice: [
    { required: true, message: '请输入可接受价格', trigger: 'blur' }
  ]
})

// 属性值
interface portProps {
  rowId?: string // 订单号
}
const props = withDefaults(defineProps<portProps>(), {
  rowId: ''
})

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (valid) {
      let params: { [key: string]: any } = {
        ...form
      }
      params.id = props.rowId
      showLoading('驳回中...')
      supplierWokkorderRejected(params)
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success('驳回成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('驳回失败')
          }
          hideLoading()
        })
        .catch((err: any) => {
          hideLoading()
        })
    }
  })
}
</script>
