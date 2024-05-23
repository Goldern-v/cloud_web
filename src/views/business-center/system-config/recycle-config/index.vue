<template>
  <div class="ideal-main-container recycle-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="120"
      class="recycle-config-form">
      <el-form-item label="自动到期策略">
        <template #label>
          <div class="flex-row">
            <div style="margin-right: 3px">自动到期策略</div>
            <el-tooltip
              effect="dark"
              placement="right"
              content="自动到期策略"
              popper-class="recycle-config__tooltip"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>
        </template>

        <el-switch v-model="form.expire" />
      </el-form-item>

      <el-form-item label="人工退订策略">
        <el-switch v-model="form.unsubscribe" />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="clickSave(formRef)">保存</el-button>
      <el-button @click="clickCancel(formRef)">恢复默认</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive({
  expire: '',
  unsubscribe: ''
})
const rules = reactive<FormRules>({})

const clickSave = (formEl: FormInstance | undefined) => {
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
const clickCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
}
</script>

<style scoped lang=scss>
.recycle-config {
  box-sizing: border-box;
  .recycle-config-form {
    padding: 20px;
    background-color: white;
  }
  .footer-button {
    align-items: center;
    background-color: white;
    margin-top: 10px;
    padding: 20px;
  }
}
</style>
<style lang="scss">
.recycle-config__tooltip {
  width: 260px;
}
</style>