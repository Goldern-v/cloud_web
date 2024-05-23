<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="允许的来源" prop="source">
        <div>
          <el-input v-model="form.source" type="textarea"/>
          <div class="ideal-tip-text">允许的来源可以设置多个，多个来源之间换行隔开，每行最多可填写一个*符号。</div>
        </div>
      </el-form-item>

      <el-form-item label="允许的方法" prop="method">
        <el-radio-group v-model="form.method">
          <el-radio-button label="Get" />
          <el-radio-button label="Post" />
          <el-radio-button label="Put" />
          <el-radio-button label="Delete" />
          <el-radio-button label="Head" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="允许的头域">
        <div>
          <el-input v-model="form.allowHeader" type="textarea"/>
          <div class="ideal-tip-text">允许的头域可设置多个，多个头域之间换行隔开，每行最多可填写一个*符号，不支持&、:、&lt;、空格以及中文字符。</div>
        </div>
      </el-form-item>

      <el-form-item label="补充头域">
        <div>
          <el-input v-model="form.supplementHeader" type="textarea"/>
          <div class="ideal-tip-text">补充头域可设置多个，多个头域之间换行隔开，不支持*、&、:、&lt;、空格以及中文字符。</div>
        </div>
      </el-form-item>

      <el-form-item label="缓存时间(秒)">
        <el-input-number v-model="form.cacheTime" :min="1" :max="1000"/>
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
  source: '', // 允许的来源
  method: '', // 允许的方法
  allowHeader: '', // 允许的头域
  supplementHeader: '', // 补充头域
  cacheTime: 1 // 缓存时间(秒)
})

const rules = reactive<FormRules>({
  source: [{ required: true, message: '请输入允许的来源', trigger: 'blur' }],
  method: [{ required: true, message: '请输入允许的方法', trigger: 'blur' }]
})

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
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate(valid => {
    if (!valid) {
      return
    }
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">

</style>
