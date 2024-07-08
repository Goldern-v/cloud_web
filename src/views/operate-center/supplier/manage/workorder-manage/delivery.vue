<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="线路编号" prop="name">
        <el-input
          v-model="form.name"
          class="custom-input"
          placeholder="请输入线路编号"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="form.remarks"
          :rows="2"
          type="textarea"
          class="custom-input"
          placeholder="请输入设备名称"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { equipmentAdd } from '@/api/java/operate-center'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
const formRef = ref<FormInstance>()
import { hideLoading, showLoading } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
const { t } = useI18n()
const form: { [key: string]: any } = reactive({
  equipmentId: '', // 线路编号
  uuid: '' // 备注
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入线路编号', trigger: 'blur' }]
})

// 属性值
interface portProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<portProps>(), {
  rowData: null
})

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
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
      let params: { [key: string]: any } = {
        ...form
      }
      showLoading('创建中...')
      equipmentAdd(params)
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success('创建设备成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('创建失败')
          }
          hideLoading()
        })
        .catch((err: any) => {
          hideLoading()
        })
    }
  })
}
</script>
