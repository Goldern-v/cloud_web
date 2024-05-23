<template>
  <div class="edit">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="组名">
        <el-input
          v-model="editForm.name"
          class="custom-input"
          placeholder="请输入组名"
        />
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="editForm.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入描述"
          class="vbf-item"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="成员" prop="memberUser">
        <el-select
          v-model="editForm.memberUser"
          placeholder="请选择"
          multiple
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) of memberUserList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="editForm.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="flex-row vpc-button--edit">
      <el-button type="info" @click="cancelForm(editFormRef)">取消</el-button>
      <el-button type="primary" @click="submitForm(editFormRef)"
        >确认</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

interface CreateProps {
  rowData?: any
}

const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({})
})

const editFormRef = ref<FormInstance>()
const editForm = reactive({
  name: '',
  id: '',
  remark: '',
  status: 0,
  memberUser: []
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入组名', trigger: 'blur' }],
  memberUser: [{ required: true, message: '请选择成员', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
})
const memberUserList: any = ref([
  { label: '用户1', value: 0 },
  { label: '用户2', value: 1 }
])

onMounted(() => {
  if (props.rowData) {
    editForm.name = props.rowData?.name
    editForm.id = props.rowData?.id
    editForm.remark = props.rowData?.remark
    editForm.status = props.rowData?.status
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
