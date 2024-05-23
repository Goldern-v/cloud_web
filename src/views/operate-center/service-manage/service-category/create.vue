<template>
  <div class="cost-center-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.remark"
          maxlength="100"
          show-word-limit
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="图标">
        <el-upload
          ref="upload"
          class="service-config-upload"
          :auto-upload="false"
          :limit="1"
          :show-file-list="false"
          :on-exceed="handleExceed"
          :on-change="handleChange"
        >
          <div>
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="service-config-upload-img"
              alt=""
            />
            <div v-else class="service-config-upload-icon">
              <svg-icon icon="add" color="#8c939d"></svg-icon>
            </div>
          </div>
        </el-upload>

        <div class="el-upload__tip">
          支持上传jpg/jpeg/png文件，图片大小不超过2M，照片比例为1:1时，显示效果更佳
        </div>
      </el-form-item>

      <el-form-item prop="sort">
        <template #label>
          <div style="margin-right: 3px">顺序</div>
          <el-tooltip
            effect="dark"
            placement="right"
            content="指定服务目录页面的排列顺序，数值小的排序靠前"
            popper-class="vdc-form--create__tooltip"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </template>
        <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
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
import { ElMessage, genFileId } from 'element-plus/es'
import type { UploadProps, UploadInstance, UploadRawFile, FormInstance, FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { nameRuleThree } from '@/utils/validate'
import { convertImageToBase64 } from '@/utils/tool'
import { uploadBase64Data } from '@/api/java/public'
import {
  serviceCategoryCreate,
  serviceCategoryUpdate
} from '@/api/java/operate-center'

interface AddCostCenterProp {
  isEdit?: boolean //是否编辑
  rowData?: any //行数据
}
const props = withDefaults(defineProps<AddCostCenterProp>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

onMounted(() => {
  if (props.isEdit) {
    imageUrl.value = props.rowData.icon
    convertImageToBase64(props.rowData.icon, (res: any) => {
      imageUrl.value = res || ''
    })
  }
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: props.rowData.name || '', // 名称
  remark: props.rowData.remark || '', // 描述
  icon: props.rowData.icon || '',
  sort: props.rowData.sort || 0 // 顺序
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  sort: [{ required: true, message: '请输入顺序', trigger: 'blur' }]
})
const upload = ref<UploadInstance>()
const imageUrl = ref('')
const changeImage = ref(false) // 是否选择或重选图标
const handleChange: UploadProps['onChange'] = (file: any) => {
  changeImage.value = true
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file.raw)
  fileReader.onloadend = (a: any) => {
    imageUrl.value = a.target.result
  }
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  if (!upload.value) { return }
  upload.value.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value.handleStart(file)
}
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
      // changeImage: true 选择或重选图标, 需重新上传
      if (changeImage.value) {
        uploadIcon()
      } else {
        handleEvent()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const uploadIcon = () => {
  const params = {
    file: imageUrl.value
  }
  uploadBase64Data(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      form.icon = data
      handleEvent()
    }
  })
}
const handleEvent = () => {
  if (props.isEdit) {
    handleEdit()
  } else {
    handleCreate()
  }
}
const handleEdit = () => {
  const params = commonParams()
  params.id = props.rowData.id
  params.status = props.rowData.status
  serviceCategoryUpdate(params).then((res: any) => {
    const { code, msg } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success('编辑服务目录成功')
    } else {
      ElMessage.error(msg || '编辑服务目录失败')
    }
  })
}
const handleCreate = () => {
  const params = commonParams()
  serviceCategoryCreate(params).then((res: any) => {
    const { code, msg } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success('创建服务目录成功')
    } else {
      ElMessage.error(msg || '创建服务目录失败')
    }
  })
}
const commonParams = (): { [key: string]: any } => {
  const params: { [key: string]: any } = {
    custom: 1, // 是否内置 0: 内置,1：自定义 (默认1)
    status: 1, // 状态 0：启用,1：不启用 (默认1)
    remark: form.remark,
    name: form.name,
    sort: form.sort,
    icon: form.icon
  }
  return params
}
</script>

<style scoped lang="scss">
.cost-center-create {
  width: 100%;
  .custom-input {
    width: 100%;
  }
  :deep .service-config-upload .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:hover {
      border-color: #409eff;
    }
  }
  .service-config-upload-icon,
  .service-config-upload-img {
    width: 100px;
    height: 100px;
  }
  .service-config-upload-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
}
</style>
