<template>
  <div class="login-container">
    <div class="login-intro">
      <h1>{{ $t('app.logoText') }}</h1>
      <div class="gradient-bg"></div>
      <div class="desc">
        {{ $t('app.description') }}
      </div>
      <!-- <div class="login-bg"><img src="@/assets/login.png" /></div> -->
    </div>
    <div class="login-form">
      <account v-if="loginType === 'account'"></account>
      <mobile v-if="loginType === 'mobile'"></mobile>
      <div class="login-more">
        <el-button type="info" link @click="loginSwitch('account')">{{
          $t('app.accountSignIn')
        }}</el-button>
        <el-button type="info" link @click="loginSwitch('mobile')">{{
          $t('app.mobileSignIn')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Account from './account.vue'
import Mobile from './mobile.vue'

// 登录类型
const loginType = ref('account')
const loginSwitch = (type: string) => {
  loginType.value = type
}
</script>

<style lang="scss" scoped>
.login-container {
  background: url('@/assets/login-bgImage.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
}
.login-intro {
  display: flex;
  flex-direction: column;
  margin-top: -450px;
  width: 520px;
  flex: 0 1 auto;
}
.login-intro h1 {
  color: var(--el-color-primary);
  font-weight: 600;
}
.login-intro .gradient-bg {
  background: linear-gradient(to left, rgba(97,168,248,0.2), rgba(54,135,255,1) );
  width: 136px;
  height: 8px;
  margin-top: 10px;
  border-radius: 5px;
}
.login-intro .desc {
  color: rgb(113, 115, 112);
  line-height: 32px;
  padding: 15px 0;
  font-weight: 400;
}
.login-bg img {
  width: 520px;
}
.login-form {
  width: 460px;
  height: 570px;
  background-color: #fff;
  flex: 0 1 auto;
  padding: 20px 40px;
  border-radius: 6px;
  box-shadow: 1px 1px 8px #aaa6a6;
  box-sizing: border-box;

  :deep(.el-input) {
    height: 45px;
    margin-top: 5px;
    .el-input__inner {
      padding: 10px 15px 10px 5px;
      height: 45px;
      line-height: 45px;
      color: #666;
      font-size: 16px;
    }
  }
}

.login-more {
  display: flex;
  justify-content: space-evenly;
  padding-top: 25px;
  width: 200px;
  margin: 0 auto;
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
  .login-captcha {
    :deep(.el-input) {
      width: 150px;
    }
  }
}
</style>
