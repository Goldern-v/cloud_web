<template>
  <div class="overview">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="overview-form"
    >
      <el-form-item label="用户账户" prop="username">
        <el-input v-model="form.username" style="width: 30%"/>
      </el-form-item>

      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="form.realName" style="width: 30%"/>
      </el-form-item>

      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email" style="width: 30%"/>
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" style="width: 30%"/>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <!-- <el-button type="primary" @click="submitForm(formRef)">{{
        t('save')
      }}</el-button> -->
      <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormRules, FormInstance, ElMessage } from 'element-plus'
import { passwordRule, validateMobile, validateEmail } from '@/utils/validate'
import { useUserApi } from '@/api/sys/user'
import { useUserSubmitApi } from '@/api/java/business-center'

const { t } = useI18n()
const route = useRoute()

const formRef = ref<FormInstance>()
const form = reactive({
  username: '', // 用户账户
  password: '', // 密码
  realName: '', // 真实姓名
  email: '', // 用户邮箱
  mobile: '', // 手机号
})
const checkPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  }
  rule.minLength = 8
  rule.maxLength = 26
  passwordRule(rule, value, callback)
}
const validPhone = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!validateMobile(value)) {
    callback(new Error('手机号码格式错误'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户账户', trigger: 'blur' }],
  password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  mobile: [{ required: true, validator: validPhone, trigger: 'blur' }]
})

const detailInfo = JSON.parse(route.query.detail as any)
onMounted(() => {
  getUserInfo(detailInfo.id)
})

const getUserInfo = (id: number) => {
  useUserApi(id).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      Object.assign(form, res.data)
    }
  })
}

// 方法
const router = useRouter()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid: any) => {
    if (valid) {
      const params = Object.assign(form, {
        id: detailInfo.id
      })
      useUserSubmitApi(params).then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          ElMessage.success({
            message: '保存成功',
            duration: 500,
            onClose: () => {
              router.back()
            }
          })
        } else {
          ElMessage.error('保存失败')
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.overview {
  width: 100%;
  .header__title {
    background-color: var(--el-color-primary-light-9);
    padding: $idealPadding;
    align-items: center;
    margin-bottom: 10px;
    // 修改分割线颜色
    :deep(.el-divider--vertical) {
      border-left: 2px var(--el-color-primary) solid;
    }
    .header__title-label {
      font-size: 16px;
      font-weight: 500;
      color: #000;
      margin-right: 10px;
    }
  }
  .overview-form {
    background-color: white;
    padding: 20px;
    .custom-input {
      width: 30%;
    }
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
