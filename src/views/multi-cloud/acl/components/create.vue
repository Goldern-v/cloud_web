<template>
  <div class="acl--create">
    <el-form
      ref="createFormRef"
      :model="createForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="createForm.name" clearable />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="createForm.description"
          type="textarea"
          class="custom-input"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(createFormRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(createFormRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { generateCode } from '@/utils/tool'

const { t } = useI18n()

const createFormRef = ref<FormInstance>()
const createForm = reactive({
  name: 'fw-' + generateCode(4),
  description: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
.acl--create {
  width: 100%;
}
</style>
