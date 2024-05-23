<template>
  <div class="lbs--edit">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="负载均衡名称" prop="name">
        <el-input v-model="editForm.name" clearable class="custom-input" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="editForm.description"
          type="textarea"
          class="custom-input"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row lbs--button">
      <el-button type="primary" @click="cancelForm(editFormRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(editFormRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleOne } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  name: '',
  description: ''
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入密钥名称'))
  }
  nameRuleOne({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }]
})

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
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
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.el-form-item__content) {
  justify-content: center;
}
.lbs--edit {
  width: 100%;
  .lbs--button {
    justify-content: center;
    align-items: center;
  }
  .custom-input {
    width: $formInputWidth;
  }
}
</style>
