<template>
  <div class="peer-connection--create">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="editForm.name" clearable class="custom-input" />
        <el-tooltip
          effect="dark"
          content="只能由英文字母、数字、下划线、中划线、点组成；长度：1-64位"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="editForm.description"
          type="textarea"
          class="custom-input"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row peer-connection--button">
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
import { nameRuleTwo } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  name: '',
  description: ''
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleTwo({ maxLength: 64, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      validator: checkName,
      trigger: 'blur'
    }
  ]
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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    console.log('submit!')
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.peer-connection--create {
  width: 100%;
  :deep(.el-form) {
    padding: 0 0 8px;
  }
  .peer-connection--button {
    justify-content: center;
    align-items: center;
  }
}
</style>
