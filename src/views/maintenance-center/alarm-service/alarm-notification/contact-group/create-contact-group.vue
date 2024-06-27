<template>
  <div class="create-contact-person">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="rule-create-form"
    >
      <el-form-item label="联系组名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入备注"
          type="textarea"
        />
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
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus/es'
import { showLoading, hideLoading } from '@/utils/tool'
import {
  alarmContactGroupCreate,
  alarmContactGroupEdit
} from '@/api/java/maintenance-center'

interface DialogProps {
  type?: OperateEventEnum | string | undefined
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  type: '',
  rowData: null
})

const { t } = useI18n()

const isEdit = computed(() => props.type === 'editContactGroup') //是否编辑页面
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

onMounted(() => {
  if (isEdit.value) {
    form.name = props.rowData.name
    form.remark = props.rowData.remark
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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (!isEdit.value) {
      const params = {
        name: form.name,
        remark: form.remark
      }
      showLoading('创建中...')
      alarmContactGroupCreate(params)
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
        remark: form.remark,
        id: props.rowData.id
      }
      showLoading('修改中...')
      alarmContactGroupEdit(params)
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
