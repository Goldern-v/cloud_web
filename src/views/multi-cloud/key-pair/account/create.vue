<template>
  <div class="account-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable class="input-width" />
      </el-form-item>

      <el-form-item label="密钥对类型">
        <div class="flex-column" style="width: 100%">
          <el-select v-model="form.type" class="input-width">
            <el-option
              v-for="(item, index) of typeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <div class="flex-row account-create__tip">
            <svg-icon
              icon="info-warning"
              color="#F3AD3C"
              class="ideal-svg-margin-right"
            ></svg-icon>
            <span
              >未开通账号密钥对的用户该参数无效，默认会创建SSH_RSA_2048的密钥对。当前仅RSA算法支持windows系统，其他算法不支持windows获取密码。</span
            >
          </div>

          <div class="flex-row">
            <el-checkbox
              v-model="form.collocation"
              label="我同意讲密钥对私钥托管到理想多云。"
            />
            <div class="ideal-theme-text">了解详情</div>
          </div>
          <div class="flex-row">
            <el-checkbox v-model="form.agree" label="我已经阅读并同意" />
            <div class="ideal-theme-text">《密钥对管理服务免责声明》</div>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { forbiddenNumberOrCN } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  type: '',
  collocation: false,
  agree: false
})
const typeList: any = ref([])

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (value === '') {
    callback(new Error('请输入密钥名称'))
  } else {
    forbiddenNumberOrCN(rule, value, callback)
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }]
})

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
.account-create {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
  }
  .input-width {
    width: 70%;
  }
  .account-create__tip {
    background-color: #fefbed;
    padding: 10px 20px;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
