<template>
  <div class="edit">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="流程标识" prop="key">
        <el-input
          v-model="editForm.key"
          class="custom-input"
          placeholder="请输入流程标识"
          disabled
        />
      </el-form-item>

      <el-form-item label="流程名称" prop="name">
        <el-input
          v-model="editForm.name"
          class="custom-input"
          placeholder="请输入流程名称"
          disabled
        />
      </el-form-item>
      <el-form-item label="流程描述" prop="description">
        <el-input
          v-model="editForm.description"
          class="custom-input"
          placeholder="请输入流程描述"
        />
      </el-form-item>
      <el-form-item label="流程表单" prop="formId">
        <el-select
          v-model="editForm.formId"
          placeholder="请选择流程表单"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) of processFormList"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row vpc-button--edit">
      <el-button type="info" @click="cancelForm(editFormRef)">取消</el-button>
      <el-button
        v-loading="formLoading"
        type="primary"
        @click="submitForm(editFormRef)"
        >确认</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { updateModel, getSimpleForm } from '@/api/java/bpm/model'

interface CreateProps {
  rowData?: any
}

const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({})
})
const formLoading = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  id: '',
  name: '',
  key: '',
  description: '',
  category: 1,
  formType: 10,
  formId: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入流程标识', trigger: 'change' }]
})

const processFormList: any = ref()
const getSimpleFormList = () => {
  getSimpleForm()
    .then((res: any) => {
      let data = res
      console.log(data, 'data')
      if (data.code === 200) {
        processFormList.value = data.data
      }
    })
    .catch((err: any) => {})
}
onMounted(() => {
  getSimpleFormList()
  if (props.rowData) {
    editForm.id = props.rowData?.id
    editForm.name = props.rowData?.name
    editForm.key = props.rowData?.key
    editForm.formId = props.rowData?.formId
    editForm.description = props.rowData?.description
  }
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
    formLoading.value = true
    try {
      const data: any = editForm
      updateModel(data)
        .then((res: any) => {
          let data = res
          if (data.code === 200) {
            ElMessage.success('编辑模型成功')
            emit(EventEnum.success)
          }
        })
        .catch((err: any) => {
          console.log('编辑模型失败')
        })
    } finally {
      formLoading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.edit {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .edit__tip {
    background-color: var(--custom-information-bg-color);
    align-items: center;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: $circleRadiusSize;
  }
  .vpc-button--edit {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
