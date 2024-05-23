<template>
  <div class="add-charge-type">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择"
          class="custom-input"
        >
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
      <el-button type="primary" @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormInstance, FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { addExpenseType, editExpenseType } from '@/api/java/operate-center'
import { nameRuleThree } from '@/utils/validate'

interface AddCostTypeProp {
  isEdit?: boolean
  rowData?: any
}
const props = withDefaults(defineProps<AddCostTypeProp>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

/* 
表单 
*/
const formRef = ref<FormInstance>()
const form = reactive({
  name: props.rowData.name || '',
  type: props.rowData.resourceCategory || ''
})
const typeList: any = [
  { label: '计算', value: 'COMPUTE' },
  { label: '存储', value: 'STORAGE' },
  { label: '网络', value: 'NETWORK' }
]

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请填写费用类型名称，不可为空'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
})

/* 
保存/取消
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
    let params: any = {
      name: form.name,
      resourceCategory: form.type
    }
    if (valid) {
      if (props.isEdit) {
        params.id = props.rowData.id
        editExpenseType(params).then((res: any) => {
          let { code } = res
          if (code === 200) {
            ElMessage.success('修改费用类型成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('修改费用类型失败')
          }
        })
      } else {
        addExpenseType(params).then((res: any) => {
          let { code } = res
          if (code === 200) {
            ElMessage.success('创建费用类型成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('创建费用类型失败')
          }
        })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.add-charge-type {
  width: 100%;
  .custom-input {
    width: 100%;
  }
}
</style>
