<template>
  <div class="bind">
    <div class="ideal-tip-text">所有选中的存储库都将绑定至同一备份策略。</div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="是否启用">
        <el-switch v-model="form.enable" />
      </el-form-item>

      <el-form-item label="备份策略">
        <div class="flex-row">
          <el-select v-model="form.backupPolicy" placeholder="请选择" style="width: 180px;" class="ideal-default-margin-right">
            <el-option
              v-for="item of backupPolicyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <svg-icon icon="refresh-icon" class="ideal-svg-margin-right" />

          <el-button>创建策略</el-button>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm(formRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  enable: false, // 是否启用
  backupPolicy: '', // 备份策略
})
const backupPolicyList: any = ref([])
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
.bind {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>