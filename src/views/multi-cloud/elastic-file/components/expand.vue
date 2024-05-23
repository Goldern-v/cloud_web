<template>
  <div class="expand">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="当前容量(GB)">
        <div>3686.00</div>
      </el-form-item>

      <el-form-item label="新容量(TB)">
        <div>
          <el-input-number v-model="form.newSize" :min="1" :max="100" />
          <div class="ideal-warning-text">文件系统不支持缩容，建议您合理选择扩容容量</div>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const formRef = ref<FormInstance>() // 校验表单
const form = reactive({
  newSize: 1
})
const rules = reactive<FormRules>({})

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
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.expand {
  width: 100%;
}
</style>
