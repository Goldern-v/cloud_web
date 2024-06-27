<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="云平台类别" prop="category">
        <el-select
          v-model="form.category"
          :disabled="isEdit"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="(item, idx) of categories"
            :key="idx"
            :label="item.name"
            :value="item.cloudCategory"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="云平台类型" prop="cloudType">
        <el-select
          v-model="form.cloudType"
          :disabled="isEdit"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="(item, idx) of cloudTypes"
            :key="idx"
            :label="item.name"
            :value="item.cloudType"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资源池" prop="resourcePool">
        <el-select
          v-model="form.resourcePool"
          :disabled="isEdit"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="(item, idx) of resourcePools"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.describe" type="textarea" style="width: 100%" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" />
      </el-form-item>

      <el-form-item label="顺序" prop="sort">
        <div>
          <el-input-number
            v-model="form.sort"
            :min="1"
            controls-position="right"
          />
          <div class="ideal-tip-text">
            指定服务目录配置中的排列顺序，数值小的排序靠前
          </div>
        </div>
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
import { ElMessage } from 'element-plus/es'
import type { FormInstance, FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { resourcePoolGrade } from '@/api/java/public'
import {
  serviceConfigResourceCreate,
  serviceConfigResourceUpdate
} from '@/api/java/operate-center'

interface AddResourceProps {
  isEdit?: boolean
  rowData?: any //行数据
}

const props = withDefaults(defineProps<AddResourceProps>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  category: '', // 云平台类别
  cloudType: '', // 云平台类型
  resourcePool: '', // 资源池
  describe: '', // 描述
  status: false, // 状态
  sort: 1 // 顺序
})
const rules = reactive<FormRules>({
  category: [{ required: true, message: '请选择云平台类别', trigger: 'blur' }],
  cloudType: [{ required: true, message: '请选择云平台类型', trigger: 'blur' }],
  resourcePool: [{ required: true, message: '请选择资源池', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入顺序', trigger: 'blur' }]
})

onMounted(() => {
  platformCategory()
})
// 云平台类别、类型
const categories = ref<any[]>([])
const platformCategory = () => {
  resourcePoolGrade()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        categories.value = data
        if (props.isEdit) {
          initEditData()
        }
      } else {
        categories.value = []
      }
    })
    .catch(_ => {
      categories.value = []
    })
}
const initEditData = () => {
  form.category = props.rowData.cloudTypeDto?.value
  form.cloudType = props.rowData.cloudPlatformDto?.value
  form.resourcePool = props.rowData.resourcePoolDto?.value
  form.sort = props.rowData.sort
  form.describe = props.rowData.remark
  form.status = props.rowData.status
}
const cloudTypes = ref<any[]>([])
watch(
  () => form.category,
  value => {
    // 创建时重选云平台类别 清空已选云平台类型和资源池
    if (!props.isEdit) {
      form.cloudType = ''
      form.resourcePool = ''
    }

    if (value) {
      const result = categories.value?.find(
        (item: any) => item.cloudCategory === value
      )
      cloudTypes.value = result?.cloudPlatformTypes
    }
  }
)
const resourcePools = ref<any[]>([])
watch(
  () => form.cloudType,
  value => {
    // 创建时重选云平台类型 清空已选资源池
    if (!props.isEdit) {
      form.resourcePool = ''
    }

    if (value) {
      const result = cloudTypes.value?.find(
        (item: any) => item.cloudType === value
      )
      resourcePools.value = result?.cloudResourcePools
    }
  }
)
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

const route = useRoute()
const serviceCategoryId = route.query.serviceCategoryId as string

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (props.isEdit) {
      handleUpdate()
    } else {
      handleCreate()
    }
  })
}
const getCommonParams = (): { [key: string]: any } => {
  const cloudPlatformItem = resourcePools.value.find(
    (item: any) => item?.id === form.resourcePool
  )
  return {
    serviceCategoryId,
    remark: form.describe,
    cloudTypeDto: {
      value: form.category
    },
    cloudPlatformDto: {
      value: form.cloudType,
      id: cloudPlatformItem?.cloudPlatform?.id
    },
    resourcePoolDto: {
      value: form.resourcePool
    },
    status: form.status,
    sort: form.sort
  }
}
// 创建
const handleCreate = () => {
  const params = getCommonParams()
  serviceConfigResourceCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success('配置底层资源成功')
    } else {
      ElMessage.error('配置底层资源失败')
    }
  })
}
// 更新
const handleUpdate = () => {
  const params = {
    id: props.rowData.id,
    remark: form.describe,
    status: form.status,
    sort: form.sort
  }
  serviceConfigResourceUpdate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      setTimeout(() => {
        emit(EventEnum.success)
      }, 3000)
      ElMessage.success('编辑底层资源成功')
    } else {
      ElMessage.error('编辑底层资源失败')
    }
  })
}
</script>

<style scoped lang="scss"></style>
