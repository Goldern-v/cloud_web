<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"
          class="custom-input"
        >
        </el-input>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { nameRuleThree } from '@/utils/validate'
import { alarmTemplateCopy } from '@/api/java/maintenance-center'

// 属性值
interface DialogProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const { t } = useI18n()

/*
 *表单
 */
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  remark: ''
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }]
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
  formEl.validate((valid: boolean) => {
    if (valid) {
      const params = Object.assign({ id: props.rowData.id }, form)

      alarmTemplateCopy(params).then((res: any) => {
        const { data, code } = res
        if (code === 200) {
          emit(EventEnum.success)
          ElMessage.success('复制模版成功')
        }
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
