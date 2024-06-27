<template>
  <div class="select-pool">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="云平台类别" prop="categoryId">
        <el-select
          v-model="form.categoryId"
          placeholder="请选择"
          :style="{ width: inputWidth }"
          @change="clickCategory"
        >
          <el-option
            v-for="(item, idx) of categories"
            :key="idx"
            :label="item[categoryLabel]"
            :value="item[categoryKey]"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="云平台类型" prop="cloudPlatformType">
        <el-select
          v-model="form.cloudPlatformType"
          placeholder="请选择"
          :style="{ width: inputWidth }"
          @change="clickType"
        >
          <el-option
            v-for="(item, idx) of cloudPlatformTypes"
            :key="idx"
            :label="item[typeLabel]"
            :value="item[typeKey]"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="云平台名称" prop="cloudPlatformId">
        <el-select
          v-model="form.cloudPlatformId"
          placeholder="请选择"
          :style="{ width: inputWidth }"
          @change="clickName"
        >
          <el-option
            v-for="(item, idx) of cloudPlatformIds"
            :key="idx"
            :label="item[nameLabel]"
            :value="item[nameKey]"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资源池" prop="resourcePoolId">
        <el-select
          v-model="form.resourcePoolId"
          placeholder="请选择"
          :style="{ width: inputWidth }"
        >
          <el-option
            v-for="(item, idx) of resourcePoolIds"
            :key="idx"
            :label="item[resourcePoolLabel]"
            :value="item[resourcePoolKey]"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div v-if="showButton" class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { getCloudResource } from '@/api/java/public'
import store from '@/store'

interface AddCostCenterProp {
  rowData?: any //行数据
  type?: string // 资源中心resourceCenter: menuId调用接口 服务目录serviceCatalog: 使用rowData的资源池数据
  categoryLabel?: string // 云平台类别显示字段
  categoryKey?: string // 云平台类别选择后的key
  typeLabel?: string // 云平台类型显示字段
  typeKey?: string // 云平台类型选择后的key
  nameLabel?: string // 云平台名称显示字段
  nameKey?: string // 云平台名称选择后的key
  resourcePoolLabel?: string // 资源池显示字段
  resourcePoolKey?: string // 资源池选择后的key
  arrayKey?: string // 子数组key
  showButton?: boolean
  inputWidth?: string
}
const props = withDefaults(defineProps<AddCostCenterProp>(), {
  rowData: () => ({}),
  type: 'serviceCatalog',
  categoryLabel: 'name',
  categoryKey: 'cloudType',
  typeLabel: 'name',
  typeKey: 'cloudPlatformCode',
  nameLabel: 'name',
  nameKey: 'cloudPlatformId',
  resourcePoolLabel: 'name',
  resourcePoolKey: 'resourcePoolId',
  arrayKey: 'itemsList',
  showButton: true,
  inputWidth: '100%'
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  categoryId: '', // 云平台类别
  cloudPlatformType: '', // 云平台类型
  cloudPlatformId: '', // 云平台名称
  resourcePoolId: '' // 资源池
})

const rules = reactive<FormRules>({
  categoryId: [
    { required: true, message: '请选择云平台类别', trigger: 'blur' }
  ],
  cloudPlatformType: [
    { required: true, message: '请选择云平台类型', trigger: 'blur' }
  ],
  resourcePoolId: [{ required: true, message: '请选择资源池', trigger: 'blur' }]
})
// 云平台类别
const categories = ref<any[]>([])
onMounted(() => {
  if (props.type === 'serviceCatalog') {
    categories.value = props.rowData[props.arrayKey]
    initData()
  } else {
    queryCloudResource()
  }
})
// 云平台类型
const cloudPlatformTypes = ref<any[]>([])
// 云平台名称
const cloudPlatformIds = ref<any[]>([])
// 资源池
const resourcePoolIds = ref<any[]>([])

const route = useRoute()
// 根据菜单id查询资源数据
const queryCloudResource = () => {
  getCloudResource({ code: route.meta.code })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        categories.value = data
        initData()
      } else {
        categories.value = []
      }
    })
    .catch(_ => {
      categories.value = []
    })
}
const initData = () => {
  // 默认显示第一条
  if (categories.value.length) {
    form.categoryId = categories.value[0][props.categoryKey]
    cloudPlatformTypes.value = categories.value[0][props.arrayKey]
    if (cloudPlatformTypes.value.length) {
      form.cloudPlatformType = cloudPlatformTypes.value[0][props.typeKey]
      cloudPlatformIds.value = cloudPlatformTypes.value[0][props.arrayKey]
      if (cloudPlatformIds.value.length) {
        form.cloudPlatformId = cloudPlatformIds.value[0][props.nameKey]
        resourcePoolIds.value = cloudPlatformIds.value[0][props.arrayKey]
        if (resourcePoolIds.value.length) {
          form.resourcePoolId = resourcePoolIds.value[0][props.resourcePoolKey]
          vdcId.value = resourcePoolIds.value[0].vdcId
        }
      }
    }
  }
}
// 云平台类别选择
const clickCategory = (value: string) => {
  // 重置云平台类型、云平台名称和资源池
  form.cloudPlatformType = ''
  form.cloudPlatformId = ''
  form.resourcePoolId = ''
  // 云平台类型:获取数组
  const result = categories.value.find(
    (item: any) => item[props.categoryKey] === value
  )
  cloudPlatformTypes.value = result[props.arrayKey]
}
// 云平台类型选择
const clickType = (value: string) => {
  // 重置云平台名称和资源池
  form.cloudPlatformId = ''
  form.resourcePoolId = ''
  const result = cloudPlatformTypes.value.find(
    (item: any) => item[props.typeKey] === value
  )
  cloudPlatformIds.value = result[props.arrayKey]
}
// 云平台名称选择
const clickName = (value: string) => {
  form.resourcePoolId = ''
  const result = cloudPlatformIds.value.find(
    (item: any) => item[props.nameKey] === value
  )
  resourcePoolIds.value = result[props.arrayKey]
}
const vdcId = ref('')
// 监听资源池
watch(
  () => form.resourcePoolId,
  (newValue, oldValue) => {
    if (oldValue !== newValue && newValue !== '') {
      // 资源池:获取数组
      const result = resourcePoolIds.value.find(
        (item: any) => item[props.resourcePoolKey] === newValue
      )
      vdcId.value = result.vdcId
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

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    const dic = Object.assign(form, { vdcId: vdcId.value })
    store.resourceStore.resourcePool = dic
    emit(EventEnum.success)
  })
}
defineExpose({
  submitForm,
  formRef,
  form
})
</script>

<style scoped lang="scss">
.select-pool {
  width: 100%;
}
</style>
