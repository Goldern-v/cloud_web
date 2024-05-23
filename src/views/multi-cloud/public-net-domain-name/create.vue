<template>
  <div class="public-domain-name-create">
    <el-form
      ref="createFormRef"
      :model="createForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="域名" prop="name">
        <el-input v-model="createForm.name" class="custom-input"></el-input>
        <div class="ideal-tip-text">例如：example.com</div>
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <ideal-tag-multiple-select class="custom-input" @selectTag="selectTag">
        </ideal-tag-multiple-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="createForm.remark"
          class="custom-input"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(createFormRef)">{{
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

const { t } = useI18n()
const createForm = reactive({
  name: '',
  remark: ''
})

const createFormRef = ref()

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入域名', trigger: 'blur' }]
})

const selectTag = () => {}

// 点击事件
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
    }
  })
}
</script>
<style scoped lang="scss">
.public-domain-name-create {
  .custom-input {
    width: 100%;
  }
}
</style>
