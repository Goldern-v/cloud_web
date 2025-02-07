<template>
  <div class="login-container">
    <div class="flex-row login-header">
      <div class="flex-row login-title">
        <img
          src="../../../../assets/supplier/logo.png"
          class="login-logo"
          alt=""
        />
        <div class="login-label">EMCP-Partners</div>
      </div>

      <div class="flex-row login-set">
        <svg-icon icon="network" />
        <div style="margin-left: 5px">Intl-简体中文</div>
      </div>
    </div>

    <div class="flex-column login-content">
      <img
        src="@/assets/supplier/title.png"
        class="login-content-title"
        alt=""
      />
      <img
        src="@/assets/supplier/gradient-bg.png"
        class="login-content-bg"
        alt=""
      />
    </div>

    <div class="flex-column login-form">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        @keyup.enter="onLogin"
      >
        <div
          class="flex-column"
          style="align-items: center; margin-bottom: 10px"
        >
          <!-- <img
            class="login-form-logo"
            src="@/assets/supplier/logo-title.png"
            alt=""
          /> -->
          <div class="login-form-title">账号登录</div>
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入您的供应商账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            placeholder="请输入您的密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha" class="login-captcha">
          <el-input
            v-model="loginForm.captcha"
            :placeholder="$t('app.captcha')"
          ></el-input>
          <img :src="captchaBase64" alt="" @click="onCaptcha" />
        </el-form-item>
        <el-form-item v-if="tip">
          <svg-icon
            icon="info-warning"
            class="ideal-svg-margin-right"
          ></svg-icon>
          <span class="tip-text">{{ tip }}</span>
        </el-form-item>
        <el-form-item label="" prop="checked">
          <el-checkbox v-model="loginForm.checked" label="" size="large" />
          <div style="font-size: 12px">
            <span>我已阅读并同意</span>
            <el-button
              text
              type="primary"
              style="padding: 0px"
              @click="agreement"
              >《云连接产品合作协议》</el-button
            >
            <span>中的条款和条件</span>
          </div>
        </el-form-item>
        <el-form-item class="login-button">
          <el-button type="primary" @click="onLogin()">{{
            $t('app.signIn')
          }}</el-button>
        </el-form-item>
        <div class="flex-row login-form-btn">
          <!-- <el-button link>注册</el-button>
          <el-divider direction="vertical" /> -->
          <el-button link>忘记密码</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'
import { useCaptchaApi } from '@/api/auth'
import { useI18n } from 'vue-i18n'
import constant from '@/utils/constant'
import Cookies from 'js-cookie'
import CacheKey from '@/utils/cache/key'
import { Base64 } from 'js-base64'

const router = useRouter()
const { t } = useI18n()
const loginFormRef = ref()
const captchaBase64 = ref()

const loginForm = reactive({
  username: constant.env.PROD ? '' : 'admin',
  password: constant.env.PROD ? '' : 'cmpHeFei@2023#',
  key: '',
  captcha: '',
  checked: false
})

const checkUsername = (rule: any, value: any, callback: (e?: Error) => any) => {
  const cnReg = /[\u4e00-\u9fa5]+/
  if (cnReg.test(value)) {
    callback(new Error('请不要输入中文'))
  }
  if (!value) {
    callback(new Error(t('required')))
  }
  callback()
}
const checkPassword = (rule: any, value: any, callback: (e?: Error) => any) => {
  const cnReg = /[\u4e00-\u9fa5]+/
  if (cnReg.test(value)) {
    callback(new Error('请不要输入中文'))
  }
  if (!value) {
    callback(new Error(t('required')))
  }
  callback()
}
const checkChecked = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback(new Error('请阅读并勾选'))
  }
  callback()
}
const loginRules = ref({
  username: [{ required: true, validator: checkUsername, trigger: 'blur' }],
  password: [{ required: true, validator: checkPassword, trigger: 'blur' }],
  captcha: [{ required: true, message: t('required'), trigger: 'blur' }],
  checked: { required: true, validator: checkChecked, trigger: 'change' }
})

onMounted(() => {
  onCaptcha()
})
const tip = ref('') //登录失败提示
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
    const params = {
      username: Base64.encode(loginForm.username),
      password: Base64.encode(loginForm.password),
      key: loginForm.key,
      captcha: loginForm.captcha
    }
    // 用户登录
    store.userStore
      .accountLoginAction(params)
      .then((res: any) => {
        const { code, data, status } = res
        if (code === 400 && status === false) {
          tip.value = data.locked
            ? `该账号已被锁定，请${data.remainTime / 60}分钟后重试`
            : `用户名或密码错误，再输错${data.remainNum}次用户将被锁定`
        } else if (code === 200 && !store.userStore.firstLogin) {
          store.appStore.setSidebarOpened(true)
          tip.value = ''
          router.push({
            path: '/operate-center/supplier/manage/information-manage/index'
          })
        }
      })
      .catch(() => {
        onCaptcha()
      })
  })
}
// 跳转协议页面
const agreement = () => {
  const url = router.resolve({
    path: '/agreement'
  })
  window.open(url.href)
}
</script>

<style lang="scss" scoped>
.login-container {
  background: url('@/assets/supplier/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  height: 100vh;
  .login-header {
    width: 100%;
    height: 64px;
    background-color: white;
    justify-content: space-between;
    align-items: center;
    .login-title {
      justify-content: space-between;
      align-items: center;
      margin-left: 20px;
      .login-logo {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 25px;
        height: 25px;
      }
      .login-label {
        font-size: 16px;
        font-weight: 500;
        margin-left: 10px;
      }
    }
    .login-set {
      background-color: #dcdcdc;
      height: 32px;
      line-height: 32px;
      margin-right: 7%;
      padding: 0 15px;
      border-radius: 3px;
    }
  }
  .login-content {
    width: 100%;
    margin-top: 2%;
    justify-content: flex-start;
    .login-content-title {
      width: 220px;
      height: 28px;
      margin-left: 15%;
    }
    .login-content-bg {
      margin: 10px 0 0 15%;
      width: 460px;
      height: 4px;
    }
  }

  .login-form {
    margin: 5% 10% 0 0;
    align-items: flex-end;
    background-color: #fff;
    width: 405px;
    flex: 0 1 auto;
    padding: 20px 40px;
    border-radius: 6px;
    box-shadow: 1px 1px 8px #dcdcdc;
    box-sizing: border-box;
    :deep(.el-input) {
      height: 45px;
      margin-top: 5px;
      .el-input__inner {
        padding: 10px 15px 10px 5px;
        height: 43px;
        line-height: 43px;
        color: #666;
        font-size: 16px;
      }
    }
    .login-form-logo {
      width: 80px;
      height: 40px;
      background-size: 100% 100%;
    }
    .login-form-title {
      margin-top: 5px;
      font-size: $mediumFontSize;
      font-weight: 500;
    }
    .login-form-btn {
      justify-content: center;
      align-items: center;
    }
  }
  .login-captcha {
    :deep(.el-input) {
      width: 150px;
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
  :deep(.svg-icon) {
    color: $error5-light;
  }
  .tip-text {
    color: $error5-light;
    font-size: $defaultFontSize;
  }
}

@media only screen and (max-width: 992px) {
  .login-intro {
    display: none;
  }
}
@media only screen and (max-width: 768px) {
  .login-container {
    background: #fff;
  }
  .login-intro {
    display: none;
  }
  .login-form {
    flex: 0 1 auto;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
