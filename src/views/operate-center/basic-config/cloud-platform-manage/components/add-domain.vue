<template>
  <div class="add-domain">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="域名标识" prop="name">
        <el-input
          v-model.trim="form.name"
          placeholder="请输入域名标识"
        />
      </el-form-item>

      <el-form-item label="域名名称" prop="domainName">
        <el-input
          v-model.trim="form.domainName"
          placeholder="请输入域名名称"
        />
      </el-form-item>

      <el-form-item label="域名访问地址" prop="objectUrl">
        <el-input
          v-model.trim="form.objectUrl"
          placeholder="请输入域名访问地址"
        />
      </el-form-item>

      <el-form-item label="协议类型" prop="protocol">
        <el-select
          v-model.trim="form.protocol"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) of protocolList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

/* 
表单 
*/
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 域名标识
  domainName: '', // 域名名称
  objectUrl: '', // 域名访问地址
  protocol: '' // 协议类型
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入域名标识', trigger: 'blur' }],
  domainName: [{ required: true, message: '请输入域名名称', trigger: 'blur' }],
  objectUrl: [{ required: true, message: '请输入域名访问地址', trigger: 'blur' }],
  protocol: [{ required: true, message: '请选择协议类型', trigger: 'blur' }]
})

const protocolList = [
  { label: 'https协议', value: 'https://' },
  { label: 'http协议', value: 'http://' }
]
/* 
方法 
*/
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success, v: object): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

//添加计费项规格
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      emit(EventEnum.success, form)
    }
  })
}
</script>

<style scoped lang="scss">
.add-domain {
  width: 100%;
}
</style>
