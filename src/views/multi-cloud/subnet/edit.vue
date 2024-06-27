<template>
  <div class="subnet--edit">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="子网名称" prop="name">
        <el-input v-model="editForm.name" clearable class="custom-input" />
        <el-tooltip
          effect="dark"
          content="名称由数字、字母、中文、-、_组成，不能以数字、_和-开头"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="子网IPv6网段">
        <el-checkbox v-model="editForm.ipv6" label="1" />
        <div>开启IPv6</div>
        <el-tooltip
          effect="dark"
          content="开启IPv6功能后，将自动为子网分配IPv6网段，但您不能选择IPv6地址范围，subnet下所有网卡关闭IPv6时，才能关闭子网IPv6。"
          placement="bottom"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="editForm.description"
          type="textarea"
          class="custom-input"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row subnet-button--edit">
      <el-button type="primary" @click="cancelForm(editFormRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(editFormRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleOne } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  name: '',
  description: '',
  ipv6: ''
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入子网名称'))
  }
  nameRuleOne({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }]
})

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
    console.log('submit!')
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.subnet--edit {
  width: 100%;
  .subnet-button--edit {
    justify-content: center;
    align-items: center;
  }
}
</style>
