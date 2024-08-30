<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="专线价格" prop="price">
        <div class="flex-row" style="width: 70%">
          <div class="flex-row">
            <el-input
              v-model="form.nrc"
              v-input.float.noChinese="{
                decimal: 4,
                obj: form,
                key: 'nrc'
              }"
            />/NRC，
          </div>
          <div class="flex-row">
            <el-input
              v-model="form.mrc"
              v-input.float.noChinese="{
                decimal: 4,
                obj: form,
                key: 'mrc'
              }"
            />/MRC
          </div>
        </div>
      </el-form-item>
      <el-form-item label="专线方案" prop="option">
        <el-input v-model="form.labourOption" :rows="4" type="textarea" />
        <div class="upload-content">
          <el-upload
            ref="uploadRef"
            class="upload-Sty"
            action="#"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :http-request="handleUpload"
            :accept="acceptType"
            :limit="1"
          >
            <template #trigger>
              <div class="add_option">
                <svg-icon
                  icon="circle-add"
                  color="var(--el-color-primary)"
                ></svg-icon>
                上传附件
              </div>
            </template>
          </el-upload>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="上传规则：支持以PDF、docx、doc、ppt、pptx格式文件上传"
            placement="bottom"
          >
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>
    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import type {
  FormInstance,
  FormRules,
  UploadProps,
  UploadRawFile
} from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { InfoFilled } from '@element-plus/icons-vue'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage, UploadInstance, genFileId } from 'element-plus'
import { portApplyCloudPort } from '@/api/java/operate-center'
const uploadRef = ref<UploadInstance>()
const { t } = useI18n()
const formRef = ref<FormInstance>() // 校验表单
const acceptType = ref('.doc,.docx,.pdf,.ppt,.pptx')
const form: { [key: string]: any } = reactive({
  nrc: '',
  mrc: '',
  labourOption: ''
})
const props = withDefaults(defineProps<{ portId: string }>(), {
  portId: ''
})
const fileList = ref({})
const loading = ref(false)
const validatePrice = (rule: any, value: any, callback: any) => {
  if (form.nrc === '' || form.mrc === '') {
    callback(new Error('日租/月租价格不能为空'))
  } else {
    callback()
  }
}
const validateOption = (rule: any, value: any, callback: any) => {
  let fileType = ''
  if (fileList.value?.name) {
    fileType =
      fileList.value?.name.split('.')[
        fileList.value?.name.split('.').length - 1
      ]
  }
  if (!(fileList.value as any).name && form.labourOption === '') {
    callback(new Error('专线方案不能为空'))
  } else if (!acceptType.value.includes(fileType)) {
    callback(new Error('文件只能上传.doc,.docx,.pdf,.ppt,.pptx格式'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  price: [{ required: true, validator: validatePrice, trigger: 'blur' }],
  option: [{ required: true, validator: validateOption, trigger: 'blur' }]
})
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
const handleExceed: UploadProps['onExceed'] = files => {
  if (!uploadRef.value) {
    return
  }
  uploadRef.value.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
  fileList.value = file
}

const handleRemove = (file: any, list: any) => {
  fileList.value = list
  formRef.value?.validateField('option')
}

const newFormData = () => {
  const fd = new FormData()
  fd.append('file', fileList.value as any)
  fd.append('routeScheme', form.labourOption)
  fd.append('nrc', form.nrc)
  fd.append('mrc', form.mrc)
  fd.append('portId', props.portId)
  return fd
}

// 上传文件
const handleUpload = async (file: any) => {
  fileList.value = file.file
  formRef.value?.validateField('option')
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async valid => {
    if (valid) {
      loading.value = true
      showLoading()
      const FormData = newFormData()
      portApplyCloudPort(FormData)
        .then(res => {
          if (res.code == '200') {
            ElMessage.success('保存成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('保存失败')
          }
          loading.value = false
          hideLoading()
        })
        .catch(err => {
          loading.value = false
          hideLoading()
        })
    }
  })
}
</script>
<style lang="scss" scoped>
.flex-row {
  display: flex;
}
.input-width {
  width: 30%;
}
.add_option {
  cursor: pointer;
  color: var(--el-color-primary);
}
.upload-content {
  position: relative;
  .el-icon {
    position: absolute;
    left: 65px;
    top: 10px;
  }
}
</style>
