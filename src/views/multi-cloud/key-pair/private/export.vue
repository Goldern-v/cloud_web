<template>
  <div class="export">
    <div class="flex-row export-tip">
      <svg-icon icon="info-warning" color="#FA9550" class="ideal-svg-margin-right"></svg-icon>
      <span
        >鉴于私钥的隐私性和保密性，请你妥善保管下载到本地的私钥，另外您后续需要时也可以再次导出。</span
      >
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >

      <el-form-item label="名称" prop="projectId">
        <div class="flex-column">
          <div>{{ form.name }}</div>

          <div class="flex-row">
            <el-checkbox v-model="form.agree"/>
            <div>我已经阅读并同意</div>
            <el-button type="primary" link>《密钥对管理服务免责声明》</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    
    <div class="flex-row footer-button">
      <el-button @click="cancelForm"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm"
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
  name: 'KeyPair-0934',
  agree: false
})
const rules = reactive<FormRules>({})

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.export {
  width: 100%;
  .export-tip {
    background-color: $warning1-light;
    padding: 10px;
    margin-bottom: 10px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
    margin-top: 10px;
  }
}
</style>