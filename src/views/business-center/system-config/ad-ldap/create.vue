<template>
  <div class="ideal-large-margin create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="create-form"
    >
      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>连接</div>
        </div>
      </el-form-item>

      <el-form-item label="AD/LDAP名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="服务器地址" prop="server">
        <el-input v-model="form.server" class="custom-input" />
      </el-form-item>

      <el-form-item label="端口号" prop="port">
        <el-input v-model="form.port" class="custom-input" />
      </el-form-item>

      <el-form-item label="Base DN" prop="baseDn">
        <el-input v-model="form.baseDn" class="custom-input" />
      </el-form-item>

      <el-form-item label="连接方式">
        <template #label>
          <div class="flex-row">
            <div style="margin-right: 3px">连接方式</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="连接方式"
              popper-class="create__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>

        <el-checkbox v-model="form.ssl" label="SSL连接" />
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>账号</div>
        </div>
      </el-form-item>

      <el-form-item label="管理员DN" prop="adminDn">
        <el-input v-model="form.adminDn" class="custom-input" />
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.pwd" class="custom-input" />
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>类型</div>
        </div>
      </el-form-item>

      <el-form-item label="类型选择">
        <el-radio-group v-model="form.type">
          <el-radio label="1">AD域服务器</el-radio>
          <el-radio label="2">LDAP域服务器</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>字段匹配规格</div>
        </div>
      </el-form-item>

      <el-form-item label="用户名">
        <el-input v-model="form.userName" class="custom-input" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="form.email" class="custom-input" />
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="form.phone" class="custom-input" />
      </el-form-item>

      <el-form-item label="昵称">
        <el-input v-model="form.nickName" class="custom-input" />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // AD/LDAP名称
  server: '', // 服务器地址
  port: '', // 端口号
  baseDn: '', // Base DN
  ssl: '', // SSL连接
  adminDn: '', // 管理员DN
  pwd: '', // 密码
  type: '', // 类型选择
  userName: '', // 用户名
  email: '',
  phone: '',
  nickName: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写AD/LDAP名称', trigger: 'blur' }],
  server: [{ required: true, message: '请填写服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请填写端口号', trigger: 'blur' }],
  baseDn: [{ required: true, message: '请填写Base DN', trigger: 'blur' }],
  adminDn: [{ required: true, message: '请填写管理员DN', trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
  })
}
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
}
</script>

<style scoped lang="scss">
.create {
  box-sizing: border-box;
  .create-form {
    background-color: white;
    padding: $idealPadding;
    .custom-input {
      width: 30%;
    }
    // 修改分割线颜色
    :deep(.el-divider--vertical) {
      border-left: 2px var(--el-color-primary) solid;
    }
  }
  .footer-button {
    align-items: center;
    background-color: white;
    margin-top: 10px;
    padding: 20px;
  }
}
</style>
<style lang="scss">
.create__tooltip {
  width: 260px;
}
</style>
