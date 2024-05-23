<template>
  <div class="create-or-edit">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="form.name" placeholder="请输入供应商名称" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.remark" placeholder="请输入描述信息" />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { showLoading, hideLoading } from '@/utils/tool'
import { compareDiffDictionary } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
import { createRole, editRole } from '@/api/java/business-center'

interface CreateProps {
  rowData?: any
  isEdit?: boolean
}
const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({}),
  isEdit: false
})

const { t } = useI18n()

const formRef = ref<FormInstance>()

const form = reactive({
  name: '', // 角色名称
  remark: '' // 描述
})
const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
})

// 表单深拷贝, 比较表单是否修改
const originDic = ref()
onMounted(() => {
  if (props.isEdit) {
    form.name = props.rowData?.name
    form.remark = props.rowData?.remark
    originDic.value = Object.assign({}, form)
  }
})

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
// 表单提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    if (props.isEdit) {
      handleEdit()
    } else {
      handleCreate()
    }
  })
}
const handleCreate = () => {
  const params = {
    name: form.name,
    remark: form.remark,
    type: false,
    roleType: 3, // 3供应商
    rolePlatformType: '1' // 0:云管平台 1: 国际公司
  }
  createRole(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success({
        message: `新增成功`,
        duration: 500,
        onClose: () => {
          emit(EventEnum.success)
        }
      })
    } else {
      ElMessage.error('新增失败')
    }
  })
}
const handleEdit = () => {
  // 筛选表单修改项, 编辑时只传修改项
  const params = compareDiffDictionary(originDic.value, form)
  params.id = props.rowData?.id
  editRole(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success({
        message: `修改成功`,
        duration: 500,
        onClose: () => {
          emit(EventEnum.success)
        }
      })
    } else {
      ElMessage.error('修改失败')
    }
  })
}
</script>
<style lang="scss" scoped>
.create-or-edit {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
