<template>
  <div class="create-folder">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="文件夹名称">
        <div>
          <el-input v-model="form.name" />
          <div>命名规则：</div>
          <div>·支持创建单个文件夹和多层级的文件夹。</div>
          <div>·单个文件夹名称不能包含以下字符：\:*?"&lt;>|。</div>
          <div>·文件夹名称不能以英文句号(.)或斜杠(/)开头或结尾。</div>
          <div>·单个斜杠(/)表示分隔并创建多层级的文件夹。</div>
          <div>·文件夹的绝对路径总长度不能超过1023字符。</div>
          <div>·不能包含两个以上相邻的斜杠(/)。</div>
        </div>
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
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: ''
})
const rules = reactive<FormRules>({})
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

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.create-folder {
  width: 100%;
}
</style>
