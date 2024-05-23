<template>
  <div class="create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="overview-form"
    >
      <el-form-item label="事件通知名称">
        <el-input v-model="form.name"/>
      </el-form-item>

      <el-form-item label="事件">
        <el-select
          v-model="form.event"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, idx) of eventList"
            :key="idx"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="前缀">
        <el-input v-model="form.prefix"/>
      </el-form-item>

      <el-form-item label="后缀">
        <el-input v-model="form.suffix"/>
      </el-form-item>

      <el-form-item label="DIS通道">
        <div style="width:100%;">
          <el-select
            v-model="form.project"
            placeholder="请选择DIS通道所在项目"
          >
            <el-option
              v-for="(item, idx) of projectList"
              :key="idx"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-select
            v-model="form.channel"
            placeholder="请选择DIS通道"
            class="ideal-middle-margin-top"
          >
            <el-option
              v-for="(item, idx) of channelList"
              :key="idx"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="IAM委托">
        <el-select
          v-model="form.delegation"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, idx) of delegations"
            :key="idx"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
  name: 'event-' + generateCode(4), // 通知名称
  event: '', // 事件
  prefix: '', // 前缀
  suffix: '', // 后缀
  project: '', // DIS通道所在项目
  channel: '', // DIS通道
  delegation: '' // IAM委托
})
const rules = reactive<FormRules>({})

const eventList = ref<any[]>([])

const projectList = ref<any[]>([])

const channelList = ref<any[]>([])

const delegations = ref<any[]>([])

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
