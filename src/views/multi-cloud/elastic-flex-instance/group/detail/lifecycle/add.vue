<template>
  <div class="add">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="挂钩名称">
        <el-input v-model="form.name" style="width: 50%" />
      </el-form-item>

      <el-form-item label="挂钩类型">
        <el-radio-group v-model="form.type" class="ideal-default-margin-right">
          <el-radio-button label="1">实例启动</el-radio-button>
          <el-radio-button label="2">实例停止</el-radio-button>
        </el-radio-group>

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="挂钩类型"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="默认回调操作">
        <el-radio-group
          v-model="form.callback"
          class="ideal-default-margin-right"
        >
          <el-radio-button label="1">继续</el-radio-button>
          <el-radio-button label="2">停止</el-radio-button>
        </el-radio-group>

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="默认回调操作"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="超时时间(秒)">
        <el-input v-model="form.timeOut" style="width: 50%" />

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="超时时间"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <!-- <el-form-item label="通知主题">
        <el-select
          v-model="form.theme"
          placeholder="请选择"
          class="ideal-default-margin-right"
          style="width: 50%;"
        >
          <el-option
            v-for="item in themeList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>

        <svg-icon icon="refresh-icon"/>

        <el-button link type="primary">新建主题</el-button>
      </el-form-item>

      <el-form-item label="自定义通知消息">
        <el-input
          v-model="form.custom"
          type="textarea"
          clearable
          style="width: 70%;"
        />
      </el-form-item> -->
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
  name: '', // 挂钩名称
  type: '', // 挂钩类型
  callback: '', // 默认回调操作
  timeOut: '', // 超时时间(秒)
  theme: '', // 通知主题
  custom: '' // 自定义通知消息
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
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
