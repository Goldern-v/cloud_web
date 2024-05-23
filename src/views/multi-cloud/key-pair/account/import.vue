<template>
  <div class="account-import">
    <div>导入公钥有两种方式：</div>
    <div>1、选择文件导入，导入成功后，可以修改公钥名称。</div>
    <div>2、复制内容到“公钥内容”文本框，手工输入公钥名称。</div>
    <div class="ideal-error-text">
      说明：仅支持导入使用RSA算法的密钥，且密钥长度为1024、2048、4096（bit）
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>

      <el-form-item label="公钥">
        <div class="flex-row">
          <div v-if="!form.publicFile" class="key-pair-file">
            未选择任何文件
          </div>
          <div v-else class="key-pair-file">{{ form.publicFile }}</div>
          <div class="key-pair--upload" @click="clickUpload">
            选择文件
            <input type="file" style="visibility: collapse; height: 0px" />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="公钥内容" prop="publicKey">
        <div class="flex-column" style="width: 100%">
          <el-input
            v-model="form.publicKey"
            type="textarea"
            placeholder="请输入公钥"
          ></el-input>

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
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
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
  publicFile: '',
  publicKey: '',
  collocation: false,
  agree: false
})

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
// 选择本地图片
const clickUpload = () => {
  const input: any = document.querySelector('input[type=file]')
  input.click()
  input.onchange = (e: any) => {
    form.publicFile = e.target.files[0].name
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = (a: any) => {
      // fileUrl.value = a.target.result
    }
  }
}

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
.account-import {
  width: 100%;
  .key-pair-file {
    line-height: 40px;
    height: 40px;
  }
  .key-pair--upload {
    cursor: pointer;
    margin-left: 10px;
    color: var(--el-color-primary);
    width: 20%;
    line-height: 40px;
    height: 40px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
  }
}
</style>
