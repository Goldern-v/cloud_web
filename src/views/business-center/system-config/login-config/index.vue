<template>
  <div class="ideal-main-container login-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="130"
      label-position="left"
      class="login-config-form">
      <el-form-item label="密码复杂度">
        <div class="flex-column login-config-form-item">
          <el-radio-group v-model="form.complexity" >
            <el-radio label="1">限制</el-radio>
            <el-radio label="2">无限制</el-radio>
          </el-radio-group>

          <template v-if="form.complexity === '1'">
            <div class="flex-row flex-row-center ideal-default-margin-top">
              <div>长度范围：</div>
              <el-input v-model="form.pwdStart" oninput="value=value.replace(/[^0-9.]/g,'')" class="ideal-default-margin-right custom-input-large"/>
              <div class="ideal-default-margin-right">-</div>
              <el-input v-model="form.pwdEnd" oninput="value=value.replace(/[^0-9.]/g,'')" class="custom-input-large"/>
            </div>

            <div class="flex-row flex-row-center ideal-default-margin-top">
              <div>密码策略：</div>
              <el-checkbox v-model="form.upperCase" label="大写字母" />
              <el-checkbox v-model="form.lowerCase" label="小写字母" />
              <el-checkbox v-model="form.number" label="数字" />
              <el-checkbox v-model="form.specialChar" label="特殊字符" />
            </div>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="密码有效期">
        <template #label>
          <div class="flex-row">
            <div class="mrg3">密码有效期</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="密码有效期"
              popper-class="login-config__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>
        <div class="flex-column login-config-form-item">
          <el-radio-group v-model="form.validity" >
            <el-radio label="1">限制</el-radio>
            <el-radio label="2">无限制</el-radio>
          </el-radio-group>

          <template v-if="form.validity === '1'">
            <div class="flex-row flex-row-center ideal-default-margin-top">
              <el-input v-model="form.validityNum" oninput="value=value.replace(/[^0-9]/g,'')" class="custom-input-large ideal-default-margin-right"/>

              <el-select v-model="form.validityCycle" placeholder="请选择">
                <el-option
                  v-for="(item, index) of cycleList"
                  :key="index + 'cycle'"
                  :label="item.label"
                  :value="item.prop"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="历史密码检查">
        <template #label>
          <div class="flex-row">
            <div class="mrg3">历史密码检查</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="历史密码检查"
              popper-class="login-config__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>
        
        <div class="flex-column login-config-form-item">
          <el-radio-group v-model="form.historyCheck" >
            <el-radio label="1">设定</el-radio>
            <el-radio label="2">不设定</el-radio>
          </el-radio-group>

          <template v-if="form.historyCheck === '1'">
            <div class="flex-row flex-row-center ideal-default-margin-top">
              <el-input v-model="form.historyCheckFreq" oninput="value=value.replace(/[^0-9]/g,'')" class="custom-input-large ideal-default-margin-right"/>
              <el-input placeholder="次" disabled class="custom-input-small"/>
            </div>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="首次登录修改密码">
        <el-radio-group v-model="form.firstChange" >
          <el-radio label="1">提示</el-radio>
          <el-radio label="2">强制</el-radio>
          <el-radio label="3">无限制</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="登录锁定机制">
        <template #label>
          <div class="flex-row">
            <div class="mrg3">登录锁定机制</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="登录锁定机制"
              popper-class="login-config__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>
        
        <div class="flex-column login-config-form-item">
          <el-radio-group v-model="form.lock" >
            <el-radio label="1">设定</el-radio>
            <el-radio label="2">不设定</el-radio>
          </el-radio-group>

          <template v-if="form.lock === '1'">
            <div class="flex-column">
              <div class="flex-row flex-row-center ideal-default-margin-top">
                <div>连续登录失败次数上限：</div>
                <el-input v-model="form.upperFailLimit" oninput="value=value.replace(/[^0-9]/g,'')" class="custom-input-large ideal-default-margin-right"/>
                <el-input placeholder="次" disabled class="custom-input-small"/>
              </div>

              <div class="flex-row flex-row-center ideal-default-margin-top">
                <div>连续登录失败次数锁定用户时长：</div>
                <el-input v-model="form.lockDuration" oninput="value=value.replace(/[^0-9]/g,'')" class="custom-input-large ideal-default-margin-right"/>
                <el-select v-model="form.lockDurationCycle" placeholder="请选择" class="custom-input-small">
                  <el-option
                    v-for="(item, index) of cycleList"
                    :key="index + 'cycle'"
                    :label="item.label"
                    :value="item.prop"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="动态验证码设定">
        <template #label>
          <div class="flex-row">
            <div class="mrg3">动态验证码设定</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="动态验证码设定"
              popper-class="login-config__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>
        
        <div class="flex-column login-config-form-item">
          <el-radio-group v-model="form.authCode" >
            <el-radio label="1">设定</el-radio>
            <el-radio label="2">不设定</el-radio>
          </el-radio-group>

          <template v-if="form.authCode === '1'">
            <div class="flex-row flex-row-center ideal-default-margin-top">
              <div>登录失败触发次数：</div>
              <el-input v-model="form.failTrigger" oninput="value=value.replace(/[^0-9]/g,'')" class="custom-input-large ideal-default-margin-right"/>
              <el-input placeholder="次" disabled class="custom-input-small"/>
            </div>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="会话超时时间">
        <template #label>
          <div class="flex-row">
            <div class="mrg3">会话超时时间</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="会话超时时间"
              popper-class="login-config__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>
        
        <div class="flex-row">
          <el-input v-model="form.overtime" class="ideal-default-margin-right"/>
          <el-select v-model="form.cycle" placeholder="请选择" >
            <el-option
              v-for="(item, index) of cycleList"
              :key="index + 'cycle'"
              :label="item.label"
              :value="item.prop"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="登录白名单">
        <template #label>
          <div class="flex-row">
            <div class="mrg3">登录白名单</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="登录白名单"
              popper-class="login-config__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>
        <el-radio-group v-model="form.whiteList" >
          <el-radio label="1">设定</el-radio>
          <el-radio label="2">不设定</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="登录白名单">
        <el-radio-group v-model="form.mode" >
          <el-radio label="1">短信登录</el-radio>
          <el-radio label="2">账户密码登录</el-radio>
          <el-radio label="3">多因子登录</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="clickSave(formRef)">保存</el-button>
      <el-button @click="clickCancel(formRef)">恢复默认</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive({
  complexity: '', // 密码复杂度
  pwdStart: '', // 密码长度范围
  pwdEnd: '',
  upperCase: false, // 大写字母
  lowerCase: false, // 小写字母
  number: false, // 数字
  specialChar: false, // 特殊字符
  validity: '', // 密码有效期
  validityNum: '', // 密码有效期-输入值
  validityCycle: '', // 密码有效期 周期
  historyCheck: '', // 历史密码检查
  historyCheckFreq: '', // 历史密码检查频率
  firstChange: '', // 首次登录修改密码
  lock: '', // 登录锁定机制
  upperFailLimit: '', // 连续登录失败次数上限
  lockDuration: '', // 连续登录失败次数锁定用户时长
  lockDurationCycle: '', 
  authCode: '', // 动态验证码设定
  failTrigger: '', // 登录失败触发次数
  overtime: '', // 会话超时时间
  cycle: '', // 会话超时时间单位
  whiteList: '', // 登录白名单
  mode: '', // 登录方式
})
const rules = reactive<FormRules>({})

const cycleList: any = ref([
  { label: '分钟', prop: 'min' },
  { label: '小时', prop: 'hour' },
  { label: '天', prop: 'day' },
  { label: '周', prop: 'week' },
  { label: '月', prop: 'month' },
  { label: '年', prop: 'year' }
])
const clickSave = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid: any) => {
    if (valid) {
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const clickCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
}
</script>

<style scoped lang=scss>
.login-config {
  box-sizing: border-box;
  .flex-row-center {
    align-items: center;
  }
  .login-config-form {
    padding: 20px;
    background-color: white;
    .login-config-form-item {
      width: 100%;
    }
  }
  .footer-button {
    margin-top: 10px;
    padding: 20px;
    background-color: white;
  }
  .custom-input-large {
    width: 120px;
  }
  .custom-input-small {
    width: 80px;
  }
  .mrg3 {
    margin-right: 3px;
  }
}
</style>
<style lang="scss">
.login-config__tooltip {
  width: 260px;
}
</style>
