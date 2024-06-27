<template>
  <div class="add">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="通知事件">
        <el-checkbox
          v-for="(item, index) of form.events"
          :key="index"
          v-model="item.isCheck"
          :label="item.label"
        />
      </el-form-item>

      <el-form-item label="通知主题">
        <el-select
          v-model="form.theme"
          placeholder="请选择"
          class="ideal-default-margin-right"
          style="width: 50%"
        >
          <el-option
            v-for="item in themeList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>

        <svg-icon icon="refresh-icon" />

        <el-button link type="primary">新建主题</el-button>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
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
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  events: [
    { label: '扩容成功', value: 'expandSuccess', isCheck: false },
    { label: '减容成功', value: 'reduceSuccess', isCheck: false },
    { label: '异常', value: 'abnormal', isCheck: false },
    { label: '扩容失败', value: 'expandFail', isCheck: false },
    { label: '减容失败', value: 'reduceFail', isCheck: false }
  ], // 通知事件
  theme: '' // 通知主题
})
const rules = reactive<FormRules>({})

const themeList = ref<any[]>([])

// 点击事件
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
    console.log('submit!')
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.add {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
