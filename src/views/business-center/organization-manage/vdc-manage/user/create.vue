<template>
  <div class="edit-box">
    <el-form
      ref="createFormRef"
      :model="createForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item v-if="showCreate" label="登录名" prop="username">
        <el-input
          v-model="createForm.username"
          clearable
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>

      <el-form-item v-if="!showPsdChange" label="用户名" prop="realName">
        <el-input
          v-model="createForm.realName"
          clearable
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>

      <el-form-item v-if="!showPsdChange" label="手机号" prop="mobile">
        <el-input
          v-model="createForm.mobile"
          clearable
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>

      <el-form-item v-if="!showPsdChange" label="用户邮箱" prop="email">
        <el-input
          v-model="createForm.email"
          clearable
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>

      <el-form-item v-if="!showEdit" label="登陆密码" prop="password">
        <el-input
          v-model="createForm.password"
          type="password"
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>

      <el-form-item v-if="!showEdit" label="确认密码" prop="confirmpassword">
        <el-input
          v-model="createForm.confirmpassword"
          type="password"
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>

      <el-form-item
        v-if="!showPsdChange"
        label="企业微信"
        prop="enterpriseWechat"
      >
        <el-input
          v-model="createForm.enterpriseWechat"
          clearable
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>

      <el-form-item v-if="!showPsdChange" label="钉钉号" prop="dingTalk">
        <el-input
          v-model="createForm.dingTalk"
          clearable
          class="custom-input ideal-default-margin-right"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row button-footer">
      <el-button @click="cancelForm(createFormRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(createFormRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import {
  nameRuleOne,
  validateEmail,
  validateMobile,
  validatePassword
} from '@/utils/validate'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { addVdcUserApi, editVdcUserApi } from '@/api/java/business-center.js'

// 属性值
interface DialogProps {
  type: OperateEventEnum | string | undefined // 操作按钮类型
  rowData?: any // 行数据
}
const { t } = useI18n()
const vdcId = useRoute().query.id
const vdcCode = useRoute().query.code
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: {}
})
const createForm = reactive({
  username: props.rowData?.username || '',
  realName: props.rowData?.realName || '',
  mobile: props.rowData?.mobile || '',
  password: '',
  confirmpassword: '',
  enterpriseWechat: props.rowData?.enterpriseWechat || '',
  dingTalk: props.rowData?.dingTalk || '',
  email: props.rowData?.email || '',
  id: props.rowData?.id || '',
  vdcId,
  vdcCode
})
const showCreate = computed(() => props.type === OperateEventEnum.create)
const showEdit = computed(() => props.type === OperateEventEnum.edit)
const showPsdChange = computed(() => props.type === OperateEventEnum.replace)
const createFormRef = ref<FormInstance>()

// 确认密码验证
const validateConfirmPassword = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!value) {
    callback(new Error('请填写确认密码'))
  } else if (value !== createForm.password) {
    callback(new Error('前后两次密码不一致'))
  } else {
    callback()
  }
}
const validPhone = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!validateMobile(value)) {
    callback(new Error('手机号码格式错误'))
  } else {
    callback()
  }
}

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!createForm.username.length) {
    callback(new Error('请输入登录名称'))
  }
  nameRuleOne({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  username: [{ required: true, validator: checkName, trigger: 'blur' }],
  realName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  mobile: [{ required: true, validator: validPhone, trigger: 'blur' }],
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmpassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
})
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid: any) => {
    if (valid) {
      if (showCreate.value) {
        const res: any = await addVdcUserApi(createForm)
        if (res.code === 200) {
          ElMessage.success('新增成功')
          formEl.resetFields()
          emit(EventEnum.success)
        } else {
          ElMessage.error('新增失败')
        }
      } else if (showEdit.value) {
        const res: any = await editVdcUserApi(createForm)
        if (res.code === 200) {
          ElMessage.success('修改成功')
          formEl.resetFields()
          emit(EventEnum.success)
        } else {
          ElMessage.error('修改失败')
        }
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.edit-box {
  width: 100%;
  .button-footer {
    justify-content: flex-end;
    align-items: center;
  }
  .custom-input {
    width: $formInputWidth;
  }
}
</style>
