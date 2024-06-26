<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="租户名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="账号" prop="name">
        <el-input v-model="form.account" class="custom-input" />
      </el-form-item>

      <el-form-item label="密码" prop="name">
        <el-input v-model="form.password" class="custom-input" />
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option
            v-for="(item, idx) of typeList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'


const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 租户名称
  account: '', // 账号
  password: '', // 密码
  type: '' // 类型
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
  account: [{ required: true, message: '请输入accesskey', trigger: 'blur' }],
  password: [{ required: true, message: '请输入secret', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
})

const typeList = [
  { label: '普通的授权账户', value: 'NORMAL' },
  { label: '必须存在的授权账户', value: 'ESSENTIAL' }
]

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success, v: {[key: string]: any}): void
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
    if (valid) {
      handleAdd()
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const handleAdd = () => {
  const params: {[key: string]: any} = {
    name: form.name,
    account: form.account,
    password: form.password,
    type: form.type
  }
  emit(EventEnum.success, params)
}
</script>

<style scoped lang="scss"></style>
