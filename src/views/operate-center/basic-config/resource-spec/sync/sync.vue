<template>
  <div class="sync-spec">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="云平台类别" prop="cloudPlatformCategory">
        <el-select
          v-model="form.cloudPlatformCategory"
          placeholder="请选择"
          class="custom-input-width"
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

      <el-form-item label="云平台类型" prop="cloudPlatformType">
        <el-select
          v-model="form.cloudPlatformType"
          placeholder="请选择"
          class="custom-input-width"
        >
          <el-option
            v-for="(item, idx) of types"
            :key="idx"
            :label="item.name"
            :value="item.cloudType"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资源池" prop="resourcePoolId">
        <el-select
          v-model="form.resourcePoolId"
          placeholder="请选择"
          class="custom-input-width"
        >
          <el-option
            v-for="(item, idx) of resourcePoolIds"
            :key="idx"
            :label="item.name"
            :value="item.region"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row sync-spec--create">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 创建和详情-基本信息
 */
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import store from '@/store'
import { resourcePoolGrade } from '@/api/java/public'
import { resourceSpecSync } from '@/api/java/operate-center'

const { t } = useI18n()

// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  cloudPlatformCategory: '',
  cloudPlatformType: '',
  resourcePoolId: ''
})
const rules = reactive<FormRules>({
  cloudPlatformCategory: [
    { required: true, message: '请选择云平台类别', trigger: 'blur' }
  ],
  cloudPlatformType: [
    { required: true, message: '请选择云平台类型', trigger: 'blur' }
  ],
  resourcePoolId: [{ required: true, message: '请选择资源池', trigger: 'blur' }]
})

onMounted(() => {
  resourcePool()
})
// 云平台类别
const categories: any = ref([])
// 获取资源池列表
const resourcePool = () => {
  const vdcId = store.userStore.user.vdcId
  resourcePoolGrade({ vdcId })
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        categories.value = data
      } else {
        categories.value = []
      }
    })
    .catch(_ => {
      categories.value = []
    })
}
// 云平台类型
const types: any = ref([])
// 监听云平台类别
watch(
  () => form.cloudPlatformCategory,
  value => {
    if (value) {
      // 云平台类别重新选择后, 云平台类型和资源池选择清空
      form.cloudPlatformType = ''
      form.resourcePoolId = ''

      const result = categories.value.find(
        (item: any) => item.cloudCategory === value
      )
      types.value = result?.cloudPlatformTypes
    }
  }
)
// 资源池
const resourcePoolIds: any = ref([])
// 监听资源池类型选择筛选资源池
watch(
  () => form.cloudPlatformType,
  value => {
    if (value) {
      form.resourcePoolId = ''

      const result = types.value.find((item: any) => item.cloudType === value)
      resourcePoolIds.value = result?.cloudResourcePools
    }
  }
)
// 点击事件
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
    submitEvent()
  })
}
const submitEvent = () => {
  let params = {
    cloudPlatformType: form.cloudPlatformType,
    resourcePoolId: form.resourcePoolId
  }
  showLoading('同步规格中......')
  resourceSpecSync(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success('同步成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(data || '同步失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
$customInputWidth: 252px;
.sync-spec {
  width: 100%;
  .sync-spec--create {
    justify-content: flex-end;
    align-items: center;
  }
  .custom-input-width {
    width: 100%;
  }
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
