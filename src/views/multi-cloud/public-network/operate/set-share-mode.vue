<template>
  <div>
    <ideal-alert-info :alert-props="alertProps" />

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="共享模式">
        <el-select
          v-model="form.shareMode"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item of shareModeList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
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
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
const alertProps = {
  alertTitleList: [
    '修改共享模式后，原项目/账户已使用的资源将继续保留且不受影响，直到被释放。'
  ],
  type: 'warning'
}

const { t } = useI18n()
const formRef = ref<FormInstance>()

const form = reactive({
  shareMode: 'global-share'
})

const rules = reactive<FormRules>({})

const shareModeList = ref([
  {
    label: '全局共享',
    value: 'global-share'
  },
  {
    label: '不共享',
    value: 'no-share'
  }
])

/**
 * 确定、取消
 */
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
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss"></style>
