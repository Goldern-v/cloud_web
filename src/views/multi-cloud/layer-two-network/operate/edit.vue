<template>
  <div>
    <el-form ref="formRef" :model="form" label-position="left" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入名称"
          class="custom-input"
        />
        <el-tooltip placement="right">
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
          <template #content
            ><div>{{ vmwarePrompt.MAZ_MIDDLE_NAME }}</div></template
          >
        </el-tooltip>
      </el-form-item>

      <el-form-item label="简介" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :autosize="{ minRows: 3 }"
          class="custom-input"
        />
        <el-tooltip placement="right">
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
          <template #content
            ><div>{{ vmwarePrompt.DESC }}</div></template
          >
        </el-tooltip>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { vmwarePrompt } from '@/utils/prompt'
const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  description: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称' }]
})

/**
 * 确定、取消
 */
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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.custom-input {
  width: 95%;
}
</style>
