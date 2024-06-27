<template>
  <div class="create-or-edit">
    <el-form
      ref="dataFormRef"
      v-loading="loading"
      :model="dataForm"
      :rules="dataRules"
      label-position="left"
    >
      <el-form-item prop="username" label="登录名">
        <el-input v-model="dataForm.username" placeholder="登录名" />
      </el-form-item>

      <el-form-item prop="realName" label="用户名">
        <el-input v-model="dataForm.realName" placeholder="用户名" />
      </el-form-item>

      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="dataForm.mobile" placeholder="手机号" />
      </el-form-item>

      <el-form-item prop="email" label="用户邮箱">
        <el-input v-model="dataForm.email" placeholder="用户邮箱" />
      </el-form-item>

      <el-form-item v-if="!isEdit" prop="password" label="登录密码">
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="登录密码"
        ></el-input>
      </el-form-item>

      <el-form-item v-if="!isEdit" prop="againPassword" label="确认密码">
        <el-input
          v-model="dataForm.againPassword"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>

      <el-form-item label="企业微信">
        <el-input v-model="dataForm.enterpriseWechat" />
      </el-form-item>

      <el-form-item label="钉钉号">
        <el-input v-model="dataForm.dingTalk" />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(dataFormRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(dataFormRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { useUserApi } from '@/api/sys/user'
import { useUserSubmitApi } from '@/api/java/business-center'
import { showLoading, hideLoading } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'

interface CreateProps {
  rowData?: any
  isEdit?: boolean
}
const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({}),
  isEdit: false
})

const { t } = useI18n()

const dataFormRef = ref<FormInstance>()
interface basicHook {
  username?: string
  realName?: string
  mobile?: string
  email?: string
  password?: string
  againPassword?: string
  enterpriseWechat?: string
  dingTalk?: string
}
const dataForm = reactive<basicHook>({
  username: '', // 登录名
  realName: '', // 用户名
  email: '',
  mobile: '',
  password: '', // 登录密码
  againPassword: '', // 确认密码
  enterpriseWechat: '', // 企业微信
  dingTalk: '' // 钉钉号
})
const dataRules = ref<FormRules>({
  username: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
  againPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' }
  ]
})

const loading = ref(false)
onMounted(() => {
  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if (props.isEdit) {
    loading.value = true
    getUser(props.rowData?.id)
  }
})

// 获取信息
const getUser = (id: number) => {
  useUserApi(id).then(res => {
    loading.value = false
    Object.assign(dataForm, res.data)
  })
}

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
// 表单提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    delete dataForm.againPassword
    let params = {}
    if (!props.isEdit) {
      params = Object.assign(dataForm, {
        status: true, //状态，默认启用
        superAdmin: 0 //超级管理员 0：否(默认) 1：是
      })
    } else {
      params = {
        id: props.rowData.id,
        userName: dataForm.username,
        realName: dataForm.realName,
        password: dataForm.password,
        mobile: dataForm.mobile,
        email: dataForm.email,
        enterpriseWechat: dataForm.enterpriseWechat,
        dingTalk: dataForm.dingTalk
      }
    }
    useUserSubmitApi(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        const operateText = props.isEdit ? '修改' : '新增'
        ElMessage.success({
          message: `${operateText}成功`,
          duration: 500,
          onClose: () => {
            emit(EventEnum.success)
          }
        })
      } else {
        ElMessage.error('操作失败')
      }
    })
  })
}
</script>
<style lang="scss" scoped>
.create-or-edit {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
