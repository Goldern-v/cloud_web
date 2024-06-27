<template>
  <div class="change">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item>
        <div class="flex-row change-tip">
          <svg-icon
            icon="info-warning"
            class-name="info-warning"
            class="ideal-svg-margin-right"
          />
          <div>
            修改桶的存储类别，不会影响桶中已有对象的存储类别，后续上传的对象默认与桶的存储类别相同。如果想批量修改桶中对象的存储类别，建议通过生命周期规则配置。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="存储类别">
        <div>
          <el-radio-group v-model="form.category">
            <el-radio label="standard">标准存储</el-radio>
            <el-radio label="lows">低频访问存储</el-radio>
            <el-radio label="archive">归档存储</el-radio>
          </el-radio-group>

          <div>
            适用于有大量热点文件或小文件，且需要频繁访问(平均一个月多次)并快速获取数据的业务逻辑。
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
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
  category: '' // 存储类别
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
.change {
  width: 100%;
  :deep(.el-form-item--default .el-form-item__label) {
    width: 100px;
  }
  .change-tip {
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    border-radius: $circleRadiusSize;
    padding: 10px;
  }
  :deep(.info-warning) {
    color: var(--el-color-primary);
  }
}
</style>
