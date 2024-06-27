<template>
  <div class="register-container">
    <div class="flex-row register-header">
      <div class="flex-row register-title">
        <img
          src="../../../../assets/supplier/logo.png"
          class="register-logo"
          alt=""
        />
        <div class="register-label">生态互联中心</div>
      </div>

      <div class="flex-row register-set">
        <svg-icon icon="network" />
        <div style="margin-left: 5px">Intl-简体中文</div>
      </div>
    </div>

    <div class="flex-column register-content">
      <img
        src="@/assets/supplier/title.png"
        class="register-content-title"
        alt=""
      />
      <img
        src="@/assets/supplier/gradient-bg.png"
        class="register-content-bg"
        alt=""
      />
    </div>

    <div class="flex-column register-form">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @keyup.enter="onReset"
      >
        <div
          class="flex-column"
          style="align-items: center; margin-bottom: 10px"
        >
          <img
            class="register-form-logo"
            src="@/assets/supplier/logo.png"
            alt=""
          />
          <div class="register-form-title">重置密码</div>
        </div>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            show-password
            placeholder="请重新设定密码"
          />
        </el-form-item>
        <el-form-item prop="againPassword">
          <el-input
            v-model="form.againPassword"
            show-password
            placeholder="请再次确认密码"
          ></el-input>
        </el-form-item>

        <el-form-item class="register-button">
          <el-button type="primary" @click="onReset()">{{
            $t('app.reset')
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'
import { useI18n } from 'vue-i18n'
import { passwordRule } from '@/utils/validate'
import { useAccountResetApi } from '@/api/auth'

const { t } = useI18n()
const formRef = ref()

const form = reactive({
  password: '',
  againPassword: ''
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
const rules = ref({
  password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
  againPassword: [
    { required: true, validator: checkConfirmPwd, trigger: 'blur' }
  ]
})

const onReset = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const params = {
      ...form,
      id: store.userStore.id
    }
    // 重置密码
    useAccountResetApi(params).then((res: any) => {
      const { code } = res
      if (code === 200) {
        // 重置密码成功后更改是否首次登录
        store.userStore.setFirstLogin(false)
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.register-container {
  background: url('@/assets/supplier/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  height: 100vh;
  .register-header {
    width: 100%;
    height: 64px;
    background-color: white;
    justify-content: space-between;
    align-items: center;
    .register-title {
      justify-content: space-between;
      align-items: center;
      margin-left: 20px;
      .register-logo {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 36px;
        height: 36px;
      }
      .register-label {
        font-size: 16px;
        font-weight: 500;
        margin-left: 10px;
      }
    }
    .register-set {
      background-color: #dcdcdc;
      height: 32px;
      line-height: 32px;
      margin-right: 7%;
      padding: 0 15px;
      border-radius: 3px;
    }
  }
  .register-content {
    width: 100%;
    margin-top: 2%;
    justify-content: flex-start;
    .register-content-title {
      width: 220px;
      height: 28px;
      margin-left: 15%;
    }
    .register-content-bg {
      margin: 10px 0 0 15%;
      width: 460px;
      height: 4px;
    }
  }

  .register-form {
    margin: 7% 10% 0 0;
    align-items: flex-end;
    background-color: #fff;
    width: 400px;
    flex: 0 1 auto;
    padding: 20px 40px;
    border-radius: 6px;
    box-shadow: 1px 1px 8px #dcdcdc;
    box-sizing: border-box;
    :deep(.el-form-item__error) {
      position: static;
    }
    :deep(.el-input) {
      height: 45px;
      width: 310px;
      margin-top: 5px;
      .el-input__inner {
        padding: 10px 15px 10px 5px;
        height: 43px;
        line-height: 43px;
        color: #666;
        font-size: 16px;
      }
    }
    .register-form-logo {
      width: 40px;
      height: 40px;
      background-size: 100% 100%;
    }
    .register-form-title {
      margin-top: 5px;
      font-size: $mediumFontSize;
      font-weight: 500;
    }
    .register-form-btn {
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    }
  }
  .register-captcha {
    :deep(.el-input) {
      width: 150px;
    }
  }
  .register-captcha img {
    width: 150px;
    height: 40px;
    margin: 5px 0 0 10px;
    cursor: pointer;
  }
  .register-button {
    :deep(.el-button--primary) {
      margin-top: 10px;
      width: 100%;
      height: 45px;
      font-size: 18px;
      letter-spacing: 8px;
    }
  }
}

@media only screen and (max-width: 992px) {
  .register-intro {
    display: none;
  }
}
@media only screen and (max-width: 768px) {
  .register-container {
    background: #fff;
  }
  .register-intro {
    display: none;
  }
  .register-form {
    flex: 0 1 auto;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
