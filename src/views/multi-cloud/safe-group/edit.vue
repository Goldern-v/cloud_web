<template>
  <div class="safe-group--edit">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称：" prop="name">
        <el-input v-model="editForm.name" class="custom-input"></el-input>
      </el-form-item>

      <el-form-item label="描述：" prop="description">
        <el-input
          v-model="editForm.description"
          type="textarea"
          class="custom-input"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row safe-group--button">
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
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  name: '',
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
.safe-group--edit {
  width: 100%;
  .safe-group--button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
