<template>
  <div class="create-contact-person">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="rule-create-form"
    >
      <el-form-item label="联系人名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" class="custom-input" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" class="custom-input" />
      </el-form-item>

      <el-form-item label="企业微信" prop="wecom">
        <el-input v-model="form.wecom" class="custom-input" />
      </el-form-item>

      <el-form-item label="钉钉" prop="dingtalk">
        <el-input v-model="form.dingtalk" class="custom-input" />
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
import type { FormInstance, FormRules } from 'element-plus'
import { nameRuleThree } from '@/utils/validate'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus/es'
import { showLoading, hideLoading } from '@/utils/tool'
import { validateMobile, validateEmail } from '@/utils/validate'
import {
  alarmContactPersonCreate,
  alarmContactPersonEdit
} from '@/api/java/maintenance-center'

// 属性值
interface DialogProps {
  type?: OperateEventEnum | string | undefined
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: '',
  rowData: null
})

const { t } = useI18n()

const isEdit = computed(() => props.type === OperateEventEnum.edit) //是否编辑页面
/*
 *表单
 */
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  phone: '',
  email: '',
  wecom: '',
  dingtalk: ''
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const checkPhone = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!validateMobile(value) && value.length) {
    callback(new Error('请输入正确手机号'))
  }
  callback()
}
const checkEmail = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (value.length) {
    validateEmail(rule, value, callback)
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  phone: [{ required: false, validator: checkPhone, trigger: 'blur' }],
  email: [{ required: false, validator: checkEmail, trigger: 'blur' }]
})

onMounted(() => {
  if (isEdit.value) {
    form.name = props.rowData.name
    form.phone = props.rowData.phone
    form.email = props.rowData.email
  }
})

/**
 * 确定/取消
 */
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
  formEl.validate(valid => {
    if (!valid) {
      return
    }
    if (!isEdit.value) {
      const params = { ...form }
      showLoading('创建中...')
      alarmContactPersonCreate(params)
        .then((res: any) => {
          const { code, data } = res
          if (code === 200) {
            ElMessage.success('创建成功')
            emit(EventEnum.success)
          } else {
            ElMessage.success('创建失败')
          }
          hideLoading()
        })
        .catch(_ => {
          hideLoading()
        })
    } else {
      const params = {
        name: form.name,
        remark: form.phone,
        email: form.email,
        id: props.rowData.id
      }
      showLoading('修改中...')
      alarmContactPersonEdit(params)
        .then((res: any) => {
          const { code, data } = res
          if (code === 200) {
            ElMessage.success('修改成功')
            emit(EventEnum.success)
          } else {
            ElMessage.success('修改失败')
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
.custom-input {
  width: 100%;
}
</style>
