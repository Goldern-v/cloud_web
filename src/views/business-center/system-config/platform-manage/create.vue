<template>
  <div class="create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="create-form"
    >
      <el-form-item v-if="isEdit" label="ID">
        <el-input v-model="form.ID" disabled />
      </el-form-item>

      <el-form-item label="平台名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="平台类型" prop="type" :required="!isEdit">
        <el-input v-model="form.type" disabled />
      </el-form-item>

      <el-form-item label="平台ID" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>

      <el-form-item label="登出URL" prop="url">
        <el-input v-model="form.url" />
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="clickCancel(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSave(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

interface PlatformProps {
  rowData?: any
  isEdit?: boolean
}

withDefaults(defineProps<PlatformProps>(), {
  rowData: () => ({}),
  isEdit: false
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  ID: '',
  name: '',
  type: 'regex',
  id: '',
  url: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写平台名称', trigger: 'blur' }],
  type: [{ required: true, message: '请填写平台类型', trigger: 'blur' }],
  id: [{ required: true, message: '请填写平台ID', trigger: 'blur' }],
  url: [{ required: true, message: '请填写登出URL', trigger: 'blur' }]
})

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const clickSave = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    emit(EventEnum.success)
  })
}
const clickCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.create {
  width: 100%;
  .create-form {
    padding: 20px;
    background-color: white;
  }
}
</style>
