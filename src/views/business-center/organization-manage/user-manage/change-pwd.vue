<template>
  <div class="create-or-edit">
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRules"
      label-position="left"
    >
      <el-form-item prop="password" label="新密码">
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="新密码"
        ></el-input>
      </el-form-item>

      <el-form-item prop="againPassword" label="确认密码">
        <el-input
          v-model="dataForm.againPassword"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(dataFormRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(dataFormRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserApi } from '@/api/sys/user'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { editUserPwd } from '@/api/java/business-center'

interface DialogProps {
  rowData?: any
}

const props = withDefaults(defineProps<DialogProps>(), {
  rowData: () => ({})
})
const { t } = useI18n()

const dataFormRef = ref<FormInstance>()
const dataForm = reactive({
  password: '', // 登录密码
  againPassword: '' // 确认密码
})
const dataRules = ref<FormRules>({
  // password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
  againPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' }
  ]
})

// 获取信息
const getUser = (id: number) => {
  useUserApi(id).then(res => {
    Object.assign(dataForm, res.data)
  })
}
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
      return false
    }
    const params = {
      id: props.rowData.id,
      password: dataForm.password,
      newPassword: dataForm.againPassword
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
}
</style>
