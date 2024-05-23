<template>
  <div class="create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-width"/>
      </el-form-item>

      <el-form-item label="选择协议版本" prop="protocol">
        <el-select
          v-model="form.protocol"
          placeholder="请选择"
          class="custom-width"
        >
          <el-option
            v-for="(item, idx) of protocols"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
            {{ item.otherName }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择加密算法套件" prop="suite">
        <el-select
          v-model="form.suite"
          placeholder="请选择"
          class="custom-width"
        >
          <el-option
            v-for="(item, idx) of suites"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
            {{ item.otherName }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.description" class="custom-width" type="textarea"/>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  protocol: '', // 协议版本
  suite: '', // 加密算法套件
  description: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  protocol: [{ required: true, message: '请选择协议版本', trigger: 'blur' }],
  suite: [{ required: true, message: '请选择加密算法套件', trigger: 'blur' }]
})

const protocols = ref<any[]>([])
const suites = ref<any[]>([])

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
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.create {
  width: 100%;
  :deep(.el-form-item--default .el-form-item__label) {
    width: 120px;
  }
  .custom-width {
    width: 100%;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
