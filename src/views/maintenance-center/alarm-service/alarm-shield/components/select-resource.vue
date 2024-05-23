<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :size="formSize"
      status-icon
    >
      <el-form-item label="云平台类别" prop="category">
        <el-select v-model="form.category" placeholder="请选择云平台类别">
          <el-option
            v-for="(item, idx) of resourcePoolData"
            :key="idx"
            :label="item.name"
            :value="item.cloudCategory"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="云平台类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择云平台类型">
          <el-option
            v-for="(item, idx) of resourcePoolTypeData"
            :key="idx"
            :label="item.name"
            :value="item.cloudType"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="资源池" prop="resourceBundleId">
        <el-select v-model="form.resourceBundleId" placeholder="请选择云资源池">
          <el-option
            v-for="(item, idx) of cloudResourcePools"
            :key="idx"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
import type { FormInstance, FormRules } from 'element-plus'
import store from '@/store'
import { EventEnum } from '@/utils/enum'
import { resourcePoolGrade } from '@/api/java/public'

// 定义from表单的类型
interface RuleForm {
  category: string
  type: string
  resourceBundleId: string
}
const formSize = ref('default')
const formRef = ref<FormInstance>()
const form = reactive<RuleForm>({
  category: '',
  type: '',
  resourceBundleId: ''
})

// 校验
const rules = reactive<FormRules<RuleForm>>({
  category: [
    { required: true, message: '请选择云平台类别', trigger: 'change' }
  ],
  type: [{ required: true, message: '请选择云平台类型', trigger: 'change' }],
  resourceBundleId: [
    { required: true, message: '请选择云资源池', trigger: 'change' }
  ]
})

const { t } = useI18n()

onMounted(() => {
  resourcePool()
})
// 资源池列表
const resourcePoolData: any = ref([])
const resourcePoolTypeData: any = ref([])
const cloudResourcePools: any = ref([])
// 获取资源池列表
const resourcePool = () => {
  const vdcId = store.userStore.user.vdcId
  resourcePoolGrade({ vdcId }).then((res: any) => {
    const { data, code } = res
    if (code === 200 && data.length > 0) {
      resourcePoolData.value = data
      resourcePoolTypeData.value =
        resourcePoolData.value.length > 0
          ? resourcePoolData.value[0].cloudPlatformTypes
          : []
    }
  })
}

watch(
  () => form.category,
  val => {
    form.type = ''
    form.resourceBundleId = ''
    if (val) {
      resourcePoolTypeData.value = resourcePoolData.value.find(
        (item: any) => item.cloudCategory === val
      ).cloudPlatformTypes
    } else {
      cloudResourcePools.value = []
    }
  }
)

watch(
  () => form.type,
  val => {
    form.resourceBundleId = ''
    if (val) {
      cloudResourcePools.value = resourcePoolTypeData.value.find(
        (item: any) => item.cloudType === val
      ).cloudResourcePools
    } else {
      cloudResourcePools.value = []
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
  formEl.validate(valid => {
    if (valid) {
      store.commonStore.setCloudCategory(form.category)
      store.commonStore.setCloudType(form.type)
      store.commonStore.setResourcePool(form.resourceBundleId)
      emit(EventEnum.success)
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss"></style>
