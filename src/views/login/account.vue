<template>
  <el-form
    ref="loginFormRef"
    :model="loginForm"
    :rules="loginRules"
    @keyup.enter="onLogin"
  >
    <div class="flex-column" style="align-items: center; margin-bottom: 10px">
      <div class="header-login"></div>
      <div class="header-title">{{ $t('app.logoText') }}</div>
    </div>
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        :prefix-icon="User"
        :placeholder="$t('app.username')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        :prefix-icon="Lock"
        show-password
        :placeholder="$t('app.password')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="captcha" class="login-captcha">
      <el-input
        v-model="loginForm.captcha"
        :placeholder="$t('app.captcha')"
        :prefix-icon="Key"
      ></el-input>
      <img :src="captchaBase64" alt="" @click="onCaptcha" />
    </el-form-item>
    <el-form-item class="login-button">
      <el-button type="primary" @click="onLogin()">{{
        $t('app.signIn')
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { User, Lock, Key } from '@element-plus/icons-vue'
import store from '@/store'
import { useCaptchaApi } from '@/api/auth'
import { useI18n } from 'vue-i18n'
import constant from '@/utils/constant'
import Cookies from 'js-cookie'
import CacheKey from '@/utils/cache/key'

const router = useRouter()
const { t } = useI18n()
const loginFormRef = ref()
const captchaBase64 = ref()

const loginForm = reactive({
  username: constant.env.PROD ? '' : 'admin',
  password: constant.env.PROD ? '' : 'cmpHeFei@2023#',
  key: '',
  captcha: ''
})

const loginRules = ref({
  username: [{ required: true, message: t('required'), trigger: 'blur' }],
  password: [{ required: true, message: t('required'), trigger: 'blur' }],
  captcha: [{ required: true, message: t('required'), trigger: 'blur' }]
})

onMounted(() => {
  onCaptcha()
})

const onCaptcha = async () => {
  const { data } = await useCaptchaApi()
  loginForm.key = data.key
  captchaBase64.value = data.image
}

const onLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    Cookies.remove(CacheKey.CookieKey)
    // 用户登录
    store.userStore
      .accountLoginAction(loginForm)
      .then(() => {
        router.push({
          path: '/operate-center/supplier/manage/information-manage/index'
        }) // /home/index  2.0首页不应该展示
      })
      .catch(() => {
        onCaptcha()
      })
  })
}
</script>

<style lang="scss" scoped>
.header-login {
  background: url('@/assets/login-title.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100px;
  height: 64px;
  margin-top: 20px;
}
.header-title {
  font-weight: 600;
  font-size: 16px;
  margin: 20px 0;
}
.login-captcha {
  :deep(.el-input) {
    width: 180px;
  }
}
.login-captcha img {
  width: 150px;
  height: 40px;
  margin: 5px 0 0 10px;
  cursor: pointer;
}
.login-button {
  :deep(.el-button--primary) {
    margin-top: 10px;
    width: 100%;
    height: 45px;
    font-size: 18px;
    letter-spacing: 8px;
  }
}
</style>
