<template>
  <div class="create-or-edit">
    <el-form
      ref="formRef"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item prop="realName" label="供应商名称">
        <el-input v-model="form.realName" placeholder="请输入供应商名称" />
      </el-form-item>

      <el-form-item prop="code" label="供应商编码">
        <el-input v-model="form.code" placeholder="请输入供应商BSS编码" />
      </el-form-item>

      <el-form-item prop="username" label="用户账号">
        <el-input v-model="form.username" placeholder="请输入用户账号" />
      </el-form-item>

      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item prop="email" label="用户邮箱">
        <el-input v-model="form.email" placeholder="请输入用户邮箱" />
      </el-form-item>

      <el-form-item v-if="!isEdit" prop="password" label="登录密码">
        <el-input
          v-model="form.password"
          show-password
          placeholder="请输入登录密码"
        ></el-input>
      </el-form-item>

      <el-form-item v-if="!isEdit" prop="againPassword" label="确认密码">
        <el-input
          v-model="form.againPassword"
          show-password
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { useUserApi } from '@/api/sys/user'
import { useUserSubmitApi } from '@/api/java/business-center'
import { showLoading, hideLoading } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
import {
  validateEmail,
  validateMobile,
  validatePassword
} from '@/utils/validate'

interface CreateProps {
  rowData?: any
  isEdit?: boolean
}
const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({}),
  isEdit: false
})

const { t } = useI18n()

const formRef = ref<FormInstance>()

const form = reactive({
  realName: '', // 供应商名称
  code: '', // 供应商编码
  username: '', // 用户账号
  mobile: '', // 手机号
  email: '', // 用户邮箱
  password: '', // 登录密码
  againPassword: '' // 确认密码
})
//手机号码校验
const validPhone = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!validateMobile(value)) {
    callback(new Error('手机号码格式错误'))
  } else {
    callback()
  }
}
// 确认密码验证
const validateConfirmPassword = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!value) {
    callback(new Error('请填写确认密码'))
  } else if (value !== form.password) {
    callback(new Error('前后两次密码不一致'))
  } else {
    callback()
  }
}
const rules = ref<FormRules>({
  realName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
  mobile: [{ required: true, validator: validPhone, trigger: 'blur' }],
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  againPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

const loading = ref(false)
onMounted(() => {
  // 重置表单数据
  if (formRef.value) {
    formRef.value.resetFields()
  }

  if (props.isEdit) {
    loading.value = true
    getUser(props.rowData?.id)
  }
})

// 获取信息
const getUser = (id: number) => {
  useUserApi(id).then(res => {
    loading.value = false
    Object.assign(form, res.data)
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
    let params = {}
    if (!props.isEdit) {
      params = createParams()
    } else {
      params = handleEdit()
    }
    useUserSubmitApi(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        const operateText = props.isEdit ? '修改' : '新增'
        ElMessage.success({
          message: `${operateText}成功`,
          duration: 500,
          onClose: () => {
            emit(EventEnum.success)
          }
        })
      } else {
        ElMessage.error('操作失败')
      }
    })
  })
}

const createParams = (): { [key: string]: any } => {
  return Object.assign(form, {
    status: true, // 启用状态，默认启用
    roleType: 3, // 3供应商
    rolePlatformType: '1', // 0:云管平台 1: 国际公司
    superAdmin: 0 // 超级管理员 0：否(默认) 1：是
  })
}
const handleEdit = (): { [key: string]: any } => {
  return {
    id: props.rowData.id,
    realName: form.realName,
    code: form.code,
    username: form.username,
    mobile: form.mobile,
    email: form.email
  }
}
</script>
<style lang="scss" scoped>
.create-or-edit {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
