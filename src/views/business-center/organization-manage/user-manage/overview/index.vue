<template>
  <div class="overview">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="overview-form"
    >
      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-label">基本信息</div>
      </div>

      <el-form-item prop="username" label="登录名">
        <el-input
          v-model="form.username"
          placeholder="登录名"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="realName" label="用户名">
        <el-input
          v-model="form.realName"
          placeholder="用户名"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="mobile" label="手机号">
        <el-input
          v-model="form.mobile"
          placeholder="手机号"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="email" label="用户邮箱">
        <el-input
          v-model="form.email"
          placeholder="用户邮箱"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="企业微信">
        <el-input v-model="form.enterpriseWechat" class="custom-input" />
      </el-form-item>

      <el-form-item label="钉钉号">
        <el-input v-model="form.dingTalk" class="custom-input" />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <!-- <el-button type="primary" @click="submitForm(formRef)">{{
        t('save')
      }}</el-button> -->
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormRules, FormInstance, ElMessage } from 'element-plus'
import { useUserApi } from '@/api/sys/user'
import { useUserSubmitApi } from '@/api/java/business-center'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const route = useRoute()
const vdcId = route.query.id

const formRef = ref<FormInstance>()
const form = reactive({
  username: '', // 登录名
  realName: '', // 用户名
  email: '',
  mobile: '',
  enterpriseWechat: '', // 企业微信
  dingTalk: '' // 钉钉号
})
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
  againPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' }
  ]
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
  formEl.validate(async (valid: boolean) => {
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
