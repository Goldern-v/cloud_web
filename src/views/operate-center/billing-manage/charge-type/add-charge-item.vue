<template>
  <div class="add-charge-type">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="计费项名称" prop="name">
        <el-input
          v-model="form.name"
          class="custom-input"
          placeholder="请输入计费项名称"
        />
      </el-form-item>

      <el-form-item label="计费项单元" prop="preUnit">
        <el-input
          v-model="form.preUnit"
          class="custom-input"
          placeholder="请输入计费项单元"
        />
      </el-form-item>

      <el-form-item label="计费项标识" prop="key">
        <el-input
          v-model="form.key"
          class="custom-input"
          placeholder="请输入标识"
        />
      </el-form-item>

      <el-form-item label="计费单位" prop="unit">
        <el-input
          v-model="form.unit"
          class="custom-input"
          placeholder="请输入计费单位"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormInstance, FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { compareDiffDictionary } from '@/utils/tool'
import { editBillItem, addBillItem } from '@/api/java/operate-center'
import { nameRuleThree } from '@/utils/validate'

interface AddCostItemProp {
  isEdit?: boolean
  expenseTypeData?: any //费用类型数据
  rowData: any //计费项行数据
}
const props = withDefaults(defineProps<AddCostItemProp>(), {
  isEdit: false,
  expenseTypeData: () => ({}),
  rowData: () => ({})
})

const { t } = useI18n()

/* 
表单
 */
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  preUnit: '',
  key: '',
  unit: ''
})
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请填写计费项名称，不可为空'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const checkPreUnit = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请填写计费项单元，不可为空'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  preUnit: [{ required: true, validator: checkPreUnit, trigger: 'blur' }],
  key: [
    { required: true, message: '请填写计费项单元，不可为空', trigger: 'blur' }
  ],
  unit: [{ required: true, message: '请填写计费单位，不可为空', trigger: 'blur' }]
})
onMounted(() => {
  if (props.isEdit) {
    initEditData()
  }
})
// 表单深拷贝, 比较表单是否修改
const originDic = ref()
const initEditData = () => {
  form.name = props.rowData?.name
  form.preUnit = props.rowData?.preUnit
  form.key = props.rowData?.code
  form.unit = props.rowData?.unit

  originDic.value = Object.assign({}, form)
}
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
    if (valid) {
      if (props.isEdit) {
        handleEdit()
      } else {
        handleCreate()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const handleCreate = () => {
  const params: any = {
    name: form.name,
    preUnit: form.preUnit,
    code: form.key,
    unit: form.unit,
    expenseTypeId: props.expenseTypeData.id
  }

  addBillItem(params).then((res: any) => {
    let { code } = res
    if (code === 200) {
      ElMessage.success('创建计费项成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('创建计费项失败')
    }
  })
}

const handleEdit = () => {
  // 筛选表单修改项
  const tempDic = compareDiffDictionary(originDic.value, form)
  const params = {
    expenseTypeId: props.expenseTypeData.id,
    id: props.rowData.id,
    ...tempDic
  }
  editBillItem(params)
    .then((res: any) => {
      let { code } = res
      if (code === 200) {
        ElMessage.success('编辑计费项成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('编辑计费项失败')
      }
    })
    .catch(err => {
      console.log(err, 'error')
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
