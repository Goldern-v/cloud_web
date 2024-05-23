<template>
  <div class="clone">
    <div class="flex-row clone-tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div>
        <div>安全组克隆时，只将原安全组出入方向规则克隆，云主机需另行关联。</div>
        <div>跨区域仅支持克隆源/目的地址是网段的规则以及是本安全组的规则。</div>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="区域" prop="area">
        <el-select
          v-model="form.area"
          placeholder="请选择"
          style="width: 70%;"
        >
          <el-option
            v-for="(item, idx) of areaList"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
            {{ item.otherName }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 70%;"/>
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
      <el-button @click="cancelForm(formRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  area: '', // 区域
  name: 'Sys-' + Math.random().toString(36).substring(7),
  description: ''
})
const areaList: any = []

const rules = reactive<FormRules>({
  area: [{ required: true, message: '请选择区域', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
.clone {
  width: 100%;
  :deep(.el-form-item--default .el-form-item__label) {
    width: 90px;
  }
  .clone-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
