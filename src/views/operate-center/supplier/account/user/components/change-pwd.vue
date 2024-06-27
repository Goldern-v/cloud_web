<template>
  <div class="create-or-edit">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item prop="password" label="新密码">
        <el-input
          v-model="form.password"
          show-password
          placeholder="新密码"
        ></el-input>
      </el-form-item>

      <el-form-item prop="againPassword" label="确认密码">
        <el-input
          v-model="form.againPassword"
          show-password
          placeholder="密码"
        ></el-input>
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
import { ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { passwordRule } from '@/utils/validate'
import { editUserPwd } from '@/api/java/business-center'

interface DialogProps {
  rowData?: any
}

const props = withDefaults(defineProps<DialogProps>(), {
  rowData: () => ({})
})
const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  password: '', // 登录密码
  againPassword: '' // 确认密码
})
// 密码验证
const checkPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  const cnReg = /[\u4e00-\u9fa5]+/
  if (cnReg.test(value)) {
    callback(new Error('请不要输入中文'))
  }

  passwordRule(rule, value, callback)
}
// 确认密码验证
const checkConfirmPwd = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  const cnReg = /[\u4e00-\u9fa5]+/
  if (cnReg.test(value)) {
    callback(new Error('请不要输入中文'))
  }
  if (!value) {
    callback(new Error('请确认密码'))
  } else if (value !== form.password) {
    callback(new Error('前后两次密码不一致'))
  } else {
    callback()
  }
}
const rules = ref<FormRules>({
  password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
  againPassword: [
    { required: true, validator: checkConfirmPwd, trigger: 'blur' }
  ]
})

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
// 表单提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    const params = {
      id: props.rowData.id,
      password: form.password,
      newPassword: form.againPassword
    }
    showLoading('修改密码中...')
    editUserPwd(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          ElMessage.success('修改密码成功')
          emit(EventEnum.success)
        } else {
          ElMessage.success('修改密码失败')
        }
        hideLoading()
      })
      .catch(_ => {
        hideLoading()
      })
  })
}
</script>
<style lang="scss" scoped>
.create-or-edit {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  :deep(.el-form-item__error) {
    position: static;
  }
}
</style>
