<template>
  <div class="change">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          clearable
          maxlength="255"
          show-word-limit
          class="custom-input"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button ideal-default-margin-top">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { showLoading, hideLoading } from '@/utils/tool'
import { safeGroupEdit } from '@/api/java/network'
import { ElMessage } from 'element-plus/es'

const { t } = useI18n()
interface changeProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<changeProps>(), {
  rowData: null
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  description: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

onMounted(() => {
  form.name = props.rowData.name
  form.description = props.rowData.description
})

//公共参数
const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
  return params
}

// 方法
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
    const params = {
      name: form.name,
      description: form.description,
      uuid: props.rowData.uuid,
      ...commonParams()
    }
    showLoading('更新中...')
    safeGroupEdit(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          ElMessage.success('更新安全组成功')
          emit(EventEnum.success)
        } else {
          ElMessage.error('更新安全组失败')
        }
        hideLoading()
      })
      .catch(err => {
        ElMessage.error(err)
        hideLoading()
      })
  })
}
</script>

<style scoped lang="scss">
.change {
  width: 100%;
  :deep(.el-form-item--default .el-form-item__label) {
    width: 90px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
  .custom-input {
    width: 100%;
  }
}
</style>
