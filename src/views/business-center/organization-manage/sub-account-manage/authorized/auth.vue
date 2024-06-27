<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="子登录名">
        <el-input v-model="form.username" disabled />
      </el-form-item>

      <el-form-item label="子用户名">
        <el-input v-model="form.realName" disabled />
      </el-form-item>

      <el-form-item label="云平台" prop="cloudPlatformIds">
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

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password />
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
import { passwordRule } from '@/utils/validate'
import {
  subAccountAuth,
  subAccountUnbindPlatform
} from '@/api/java/business-center'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  realName: '',
  cloudPlatformIds: [], // 云平台
  password: '' // 授权账户登录密码
})
const checkPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  }
  rule.minLength = 8
  rule.maxLength = 26
  passwordRule(rule, value, callback)
}
const rules = reactive<FormRules>({
  cloudPlatformIds: [
    { required: true, message: '请选择云平台', trigger: 'blur' }
  ],
  password: [{ required: true, validator: checkPwd, trigger: 'blur' }]
})

const route = useRoute()
const detailInfo = JSON.parse(route.query.detail as any)
onMounted(() => {
  form.username = detailInfo.username
  form.realName = detailInfo.realName
  getUnbindPlatform()
})

const cloudPlatformIdsList = ref<any[]>([])
const getUnbindPlatform = () => {
  subAccountUnbindPlatform(detailInfo.id)
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
    handleCreate()
  })
}
const handleCreate = () => {
  const params = {
    id: detailInfo.id, // 子账户id
    cloudPlatformIds: form.cloudPlatformIds,
    password: form.password
  }
  subAccountAuth(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('授权成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('授权失败')
    }
  })
}
</script>

<style scoped lang="scss"></style>
