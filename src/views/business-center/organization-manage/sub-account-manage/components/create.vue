<template>
  <div class="create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="主用户">
        <el-input v-model="masterUser" disabled />
      </el-form-item>

      <el-form-item v-if="!isEdit" label="云平台" prop="cloudPlatformIds">
        <el-select
          v-model="form.cloudPlatformIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="(item, idx) of cloudPlatformIdsList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="子登录名" prop="username">
        <el-input v-model="form.username" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="子用户名" prop="realName">
        <el-input v-model="form.realName" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" />
      </el-form-item>

      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>

      <el-form-item v-if="!isEdit" label="登录密码" prop="password">
        <el-input v-model="form.password" show-password />
      </el-form-item>

      <el-form-item v-if="!isEdit" label="确认密码" prop="password">
        <el-input v-model="form.againPassword" show-password />
      </el-form-item>

      <el-form-item label="企业微信">
        <el-input v-model="form.enterpriseWechat" />
      </el-form-item>

      <el-form-item label="钉钉号">
        <el-input v-model="form.dingTalk" />
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus/es'
import type { FormInstance, FormRules } from 'element-plus'
import { passwordRule, validateMobile, validateEmail } from '@/utils/validate'
import { compareDiffDictionary } from '@/utils/tool'
import store from '@/store'
import { subAccountCreate, useUserSubmitApi } from '@/api/java/business-center'
import { cloudPlatformList } from '@/api/java/operate-center'

interface CreateProps {
  isEdit?: boolean
  rowData?: any
}
const props = withDefaults(defineProps<CreateProps>(), {
  isEdit: false,
  rowData: null
})

onMounted(() => {
  if (props.isEdit) {
    initEdit()
  }
  getPlatform()
})
const cloudPlatformIdsList = ref<any[]>([])
// 云平台
const getPlatform = () => {
  cloudPlatformList({ cloudCategory: 'PUBLIC' })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        cloudPlatformIdsList.value = data
      } else {
        cloudPlatformIdsList.value = []
      }
    })
    .catch(_ => {
      cloudPlatformIdsList.value = []
    })
}
// 表单深拷贝, 比较表单是否修改
const originDic = ref()
// 编辑信息
const initEdit = () => {
  form.username = props.rowData?.username
  form.realName = props.rowData?.realName
  form.mobile = props.rowData?.mobile
  form.email = props.rowData?.email
  form.enterpriseWechat = props.rowData?.enterpriseWechat
  form.dingTalk = props.rowData?.dingTalk

  originDic.value = Object.assign({}, form)
}

const { t } = useI18n()
const masterUser = store.userStore.user.realName

const formRef = ref<FormInstance>()
const form = reactive({
  cloudPlatformIds: '', // 云平台
  username: '', // 子登录名
  realName: '', // 子用户名
  mobile: '', // 手机号
  email: '', // 用户邮箱
  password: '', // 登录密码
  againPassword: '', // 确认密码
  enterpriseWechat: '', // 企业微信
  dingTalk: '' // 钉钉号
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
// 确认密码验证
const validateAgainPwd = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!value) {
    callback(new Error('请填写确认密码'))
  } else if (value !== form.password) {
    callback(new Error('前后两次密码不一致'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  cloudPlatformIds: [
    { required: true, message: '请选择云平台', trigger: 'blur' }
  ],
  username: [{ required: true, message: '请输入子登录名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入子用户名', trigger: 'blur' }],
  mobile: [{ required: true, validator: validPhone, trigger: 'blur' }],
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
  againPassword: [
    { required: true, validator: validateAgainPwd, trigger: 'blur' }
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

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (props.isEdit) {
      handleEdit()
    } else {
      handleCreate()
    }
  })
}
const handleCreate = () => {
  const params = {
    username: form.username,
    password: form.password,
    realName: form.realName,
    email: form.email,
    mobile: form.mobile,
    status: '1', // 后端默认传1 启用
    cloudPlatformIds: form.cloudPlatformIds,
    enterpriseWechat: form.enterpriseWechat,
    dingTalk: form.dingTalk
  }
  subAccountCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('新增成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('新增失败')
    }
  })
}
const handleEdit = () => {
  // 筛选表单修改项, 编辑时只传修改项
  const tempDic = compareDiffDictionary(originDic.value, form)

  const params: { [key: string]: any } = { id: props.rowData?.id }

  const secret: { [key: string]: any } = {}
  for (const key in tempDic) {
    params[key] = tempDic[key]
  }
  useUserSubmitApi(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">
.create {
  width: 100%;
  :deep(.el-form-item__error) {
    position: static;
  }
}
</style>
