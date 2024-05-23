<template>
  <div class="create-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">

      <el-form-item label="云平台类型" prop="cloudType">
        <el-select v-model="form.cloudType" placeholder="请选择" class="custom-input">
          <el-option
            v-for="(item, idx) of cloudTypeList"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资源池" prop="resource">
        <el-select v-model="form.resource" placeholder="请选择" class="custom-input">
          <el-option
            v-for="(item, idx) of resourceList"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="url前缀">
        <el-input v-model="form.url" class="custom-input"/>
      </el-form-item>

      <el-form-item label="区域" prop="zone">
        <el-select v-model="form.zone" placeholder="请选择" class="custom-input">
          <el-option
            v-for="(item, idx) of zoneList"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>  

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  cloudType: '', // 云平台类型
  resource: '', // 资源池
  url: '', 
  zone: '', // 区域
})
const rules = reactive<FormRules>({
  cloudType: [{ required: true, message: '请选择云平台类型', trigger: 'blur' }],
  resource: [{ required: true, message: '请选择资源池', trigger: 'blur' }],
  zone: [{ required: true, message: '请选择区域', trigger: 'blur' }]
})

const cloudTypeList: any = ref([])
const resourceList: any = ref([])
const zoneList: any = ref([])

// 方法
interface EmitEvents {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvents>()

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
  formEl.validate(async (valid: any) => {
    if (valid) {
      
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.create-container {
  width: 100%;
  .custom-input {
    width: 100%;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
