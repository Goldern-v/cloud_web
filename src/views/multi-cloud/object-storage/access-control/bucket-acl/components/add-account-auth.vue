<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="账号">
        <div>
          <el-input v-model="form.account" placeholder="请输入账号ID"/>
          <div class="ideal-tip-text">仅支持对账号配置ACL，不支持IAM用户。</div>
          <div class="ideal-warning-text">暂时仅支持输入账号ID</div>
        </div>
      </el-form-item>

      <el-form-item label="桶访问权限">
        <el-checkbox-group v-model="form.bucketAuth">
          <el-checkbox label="读取权限"/>
          <el-checkbox label="写入权限"/>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="对象权限">
        <el-checkbox-group v-model="form.objectAuth">
          <el-checkbox label="对象读权限" disabled/>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="ACL访问权限">
        <el-checkbox-group v-model="form.aclAuth">
          <el-checkbox label="读取权限"/>
          <el-checkbox label="写入权限"/>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  account: '', // 账号
  bucketAuth: [] as any[], // 桶访问权限
  objectAuth: [] as any[], // 对象权限
  aclAuth: [] as any[] // ACL访问权限
})
const rules = reactive<FormRules>({})

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate(valid => {
    if (!valid) {
      return
    }
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">

</style>
