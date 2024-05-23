<template>
  <div class="create">
    <div class="flex-row create-tip ideal-middle-margin-bottom">
      <svg-icon icon="info-warning" class-name="info-warning" class="ideal-svg-margin-right"/>
      <div>若对象在生命周期规则作用下，存储时间少于最低存储时间，需要补足剩余天数的存储费用。目前低频访问存储、归档存储的最低存储时间为30天、90天。</div>
    </div>

    <div class="ideal-tip-text ideal-middle-margin-bottom">
      启用生命周期规则后，受规则影响的对象将在指定天数后转换存储类别或自动删除。由于删除对象会减少存储用量以及不同存储类别之间存在价格差异，因此费用也会发生变化。
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="overview-form"
    >
      <div>基本信息</div>

      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio label="enable">启用</el-radio>
          <el-radio label="forbidden">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="规则名称">
        <el-input v-model="form.name" style="width: 40%;"/>
      </el-form-item>

      <el-form-item label="前缀">
        <el-input v-model="form.prefix" style="width: 40%;"/>
      </el-form-item>

      <el-divider />

      <div>当前版本</div>

      <el-form-item label="转换为低频访问存储天数">
        <div class="flex-row">
          <el-checkbox v-model="form.lowsCheck" style="margin-right: 10px;"/>
          <el-input v-model="form.lows" :disabled="!form.lowsCheck"/>
        </div>
      </el-form-item>

      <el-form-item label="转换为归档存储天数">
        <div class="flex-row">
          <el-checkbox v-model="form.archiveCheck" style="margin-right: 10px;"/>
          <el-input v-model="form.archive" :disabled="!form.archiveCheck"/>
        </div>
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
import { generateCode } from '@/utils/tool'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  status: 'enable', // 状态
  name: 'rule-' + generateCode(4), // 规则名称
  prefix: '', // 前缀
  lows: '30',
  lowsCheck: false,
  archive: '30',
  archiveCheck: false
})
const rules = reactive<FormRules>({})

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
      return false
    }
    emit(EventEnum.success)
  })
}

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.create {
  :deep(.el-form-item--default .el-form-item__label ) {
    width: 130px;
  }
  :deep(.info-warning) {
    color: var(--el-color-primary)
  }
  .create-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
  }
}

</style>
