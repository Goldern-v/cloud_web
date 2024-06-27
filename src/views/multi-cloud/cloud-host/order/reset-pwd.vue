<template>
  <div class="reset-pwd">
    <div class="flex-row reset-pwd__tip">
      <svg-icon
        icon="info-warning"
        color="#F3AD3C"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span
        >重置密码功能需要在开机状态下使用，弹性云服务器重启后，新密码自动生效。</span
      >
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="云主机名称">
        <el-input v-model="form.name" disabled />
      </el-form-item>

      <el-form-item label="新密码" prop="pwd">
        <el-input v-model="form.pwd" show-password />
      </el-form-item>

      <el-form-item label="确认密码" prop="againPwd">
        <el-input v-model="form.againPwd" show-password />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { cloudHostResetPwd } from '@/api/java/compute'

const { t } = useI18n()
interface ResetPwdProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<ResetPwdProps>(), {
  rowData: () => ({})
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  pwd: '',
  againPwd: ''
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value !== form.pwd) {
    callback(new Error('两个密码输入不匹配!'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  againPwd: [{ required: true, validator: validatePass, trigger: 'blur' }]
})

onMounted(() => {
  form.name = props.rowData?.name
})

// 点击事件
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
    if (valid) {
      const params = {
        uuid: props?.rowData?.uuid,
        password: form.pwd
      }
      showLoading('重置密码中...')
      cloudHostResetPwd(params)
        .then((res: any) => {
          const { msg, code, status, data } = res
          if (code === 200 && status) {
            ElMessage.success(data)
            emit(EventEnum.success)
          } else {
            ElMessage.error(msg || '重置密码失败')
          }
          hideLoading()
        })
        .catch(_ => {
          hideLoading()
        })
    }
  })
}
</script>

<style scoped lang="scss">
.reset-pwd {
  width: 100%;
  .reset-pwd__tip {
    background-color: #fefbed;
    padding: 20px;
    align-items: center;
    margin-bottom: 20px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
