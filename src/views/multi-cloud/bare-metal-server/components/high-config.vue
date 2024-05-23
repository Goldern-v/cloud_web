<template>
  <div class="high-config">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="裸金属服务器名称" prop="cloudHostName">
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-input
                v-model="form.cloudHostName"
                class="ideal-default-margin-right custom-input"
              />
            </div>
            <div class="flex-row">
              <div class="ideal-tip-text">
                购买多台裸金属服务器时，系统自动增加后缀，例如：bms-0001。
              </div>
              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="裸金属服务器名称"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="登录凭证">
          <div class="flex-column">
            <el-radio-group
              v-model="form.loginCredentials"
              class="ideal-default-margin-right"
            >
              <el-radio-button
                v-for="(item, index) of state.loginCredentialsList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <div
              v-if="form.loginCredentials === '2'"
              class="ideal-warning-text"
            >
              请妥善保管密钥对的私钥文件，登录裸金属服务器时，需要使用该文件。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.loginCredentials === '1'" label="用户名">
          <div>root</div>
        </el-form-item>

        <el-form-item
          v-if="form.loginCredentials === '1'"
          label="密码"
          prop="securityCode"
        >
          <div class="flex-column" style="width: 100%">
            <el-input
              v-model="form.securityCode"
              class="custom-input"
              show-password
              autocomplete="new-password"
            />
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.loginCredentials === '1'"
          label="确认密码"
          prop="againSecurityCode"
        >
          <el-input
            v-model="form.againSecurityCode"
            class="custom-input"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>

        <el-form-item v-if="form.loginCredentials === '2'" label="密钥对">
          <div>
            <div class="flex-row">
              <el-select
                v-model="form.keyPair"
                placeholder="请选择密钥对"
                class="ideal-default-margin-right"
              >
                <el-option
                  v-for="item in state.keyPairList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                class="ideal-svg-margin-right"
                @click="clickRefreshKeyPair"
              ></svg-icon>
              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="密钥对"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>

            <div class="ideal-tip-text">密钥对登录方式创建的Linux裸金属服务器，如需使用裸金属服务器页面的远程登录功能，请先在裸金属服务器创建完成后设置登录密码。</div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { useHigh } from './high-config'
import { IHooksHigh } from './interface'

const formRef = ref<FormInstance>()
// 表单
const form = reactive({
  resourceId: '',
  regionId: '',
  cloudHostName: 'bms-' + Math.random().toString(36).substring(7), // 裸金属服务器名称
  loginCredentials: '1', // 登录凭证
  loginCredentialsName: '', // (供确认配置界面使用)
  keyPair: '', // 密钥对
  securityCode: '', // 密码
  againSecurityCode: ''
})

const checkPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  }
  callback()
}
const checkAgainPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback(new Error('请输入确认密码'))
  }
  if (form.securityCode !== form.againSecurityCode) {
    callback(new Error('输入密码不一致！'))
  }
  callback()
}
const rules = reactive<FormRules>({
  cloudHostName: [
    { required: true, message: '请输入云服务器名称', trigger: 'blur' }
  ],
  securityCode: [{ required: true, validator: checkPwd, trigger: 'blur' }],
  againSecurityCode: [
    { required: true, validator: checkAgainPwd, trigger: 'blur' }
  ]
})

const state: IHooksHigh = reactive({
  form
})
const {
  clickRefreshKeyPair
} = useHigh(state)

const cloudGroupList: any = [{ label: '反亲和性', value: '1' }]

defineExpose({
  formRef,
  form
})
</script>

<style scoped lang="scss">
.high-config {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .flex-column-start {
    justify-content: flex-start;
    align-items: flex-start;
  }
  .flex-row-start-center {
    justify-content: flex-start;
    align-items: center;
  }
  .custom-input {
    width: 50%;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
