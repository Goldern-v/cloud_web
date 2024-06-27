<template>
  <div class="cost-center-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.describe"
          maxlength="100"
          show-word-limit
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="图标" prop="iconUrl">
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

      <el-form-item label="关联产品" prop="associateProduct">
        <el-cascader
          v-model="form.associateProduct"
          :options="productList"
          :props="productProps"
          :show-all-levels="false"
          style="width: 50%"
        />
      </el-form-item>

      <el-form-item label="服务类型" prop="serviceType">
        <el-select
          v-model="form.serviceType"
          placeholder="请选择"
          style="width: 50%"
        >
          <el-option
            v-for="(item, idx) of serviceTypeList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="服务类别" prop="serviceCategory">
        <el-select
          v-model="form.serviceCategory"
          placeholder="请选择"
          style="width: 50%"
        >
          <el-option
            v-for="(item, idx) of serviceCategories"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="sort">
        <template #label>
          <div style="margin-right: 3px">顺序</div>
          <el-tooltip
            effect="dark"
            placement="right"
            content="指定服务类别的排列顺序，数值小的排序靠前"
            popper-class="vdc-form--create__tooltip"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </template>
        <el-input-number
          v-model="form.sort"
          controls-position="right"
          :min="1"
        />
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
import { EventEnum } from '@/utils/enum'
import { nameRuleThree } from '@/utils/validate'
import { ElMessage, genFileId } from 'element-plus/es'
import type {
  UploadProps,
  UploadInstance,
  UploadRawFile,
  UploadUserFile,
  FormInstance,
  FormRules
} from 'element-plus'
import { uploadBase64Data } from '@/api/java/public'
import {
  serviceConfigProduct,
  serviceCategoryList,
  serviceConfigCreate,
  serviceConfigUpdate
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

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  describe: '', // 描述
  iconUrl: '',
  associateProduct: [] as any[], // 关联产品
  serviceType: '', // 服务类型
  serviceCategory: '', // 服务类别
  sort: 1
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  associateProduct: [
    { required: true, message: '请选择关联产品', trigger: 'blur' }
  ],
  serviceType: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
  serviceCategory: [
    { required: true, message: '请选择服务类别', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.isEdit) {
    initEditData()
  }
  queryProduct()
  queryCategory()
})
const initEditData = () => {
  form.name = props.rowData.name
  form.describe = props.rowData.remark
  form.serviceType = props.rowData.serviceCategoryType.value
  form.serviceCategory = props.rowData.serviceCategoryDefinition.id
  form.sort = props.rowData.sort
  imageUrl.value = props.rowData.iconUrl
  form.associateProduct = JSON.parse(props.rowData.bak)
}

const productList: any = ref([])
const productProps = {
  children: 'children',
  label: 'name',
  value: 'id'
}
// 关联产品
const queryProduct = () => {
  serviceConfigProduct()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        productList.value = data
      } else {
        productList.value = []
      }
    })
    .catch(_ => {
      productList.value = []
    })
}
const serviceCategories: any = ref([])
// 服务类别
const queryCategory = () => {
  serviceCategoryList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        serviceCategories.value = data
      } else {
        serviceCategories.value = []
      }
    })
    .catch(_ => {
      serviceCategories.value = []
    })
}
// 服务类型
const serviceTypeList: any = ref([
  { label: '云资源部署', value: 'CLOUD_RESOURCE_DEPLOYMENT' },
  { label: '云应用部署', value: 'CLOUD_APPLICATION_DEPLOYMENT' }
])
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
const handleExceed: UploadProps['onExceed'] = files => {
  if (!upload.value) {
    return
  }
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

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (changeImage.value) {
      uploadIcon()
    } else {
      handleEvent()
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
      form.iconUrl = data
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
  serviceConfigUpdate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success('编辑服务配置成功')
    } else {
      ElMessage.error('编辑服务配置失败')
    }
  })
}
const handleCreate = () => {
  const params = commonParams()
  serviceConfigCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success('创建服务配置成功')
    } else {
      ElMessage.error('创建服务配置失败')
    }
  })
}

const commonParams = (): { [key: string]: any } => {
  const params: { [key: string]: any } = {
    name: form.name,
    iconUrl: form.iconUrl,
    sort: form.sort,
    remark: form.describe,
    custom: '1',
    serviceCategoryDefinition: {
      id: form.serviceCategory
    },
    menu: {
      menuId: String(form.associateProduct.slice(-1)[0])
    },
    serviceCategoryType: {
      value: form.serviceType
    },
    bak: JSON.stringify(form.associateProduct)
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
