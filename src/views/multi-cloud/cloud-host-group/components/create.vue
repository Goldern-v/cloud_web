<template>
  <div class="create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="区域" prop="regionId">
        <el-select
          v-model="form.regionId"
          placeholder="请选择"
          class="custom-width"
        >
          <el-option
            v-for="(item, idx) of regionList"
            :key="idx"
            :label="item.cnName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="项目" prop="projectId">
        <el-select
          v-model="form.projectId"
          placeholder="请选择"
          class="custom-width"
        >
          <el-option
            v-for="(item, idx) of projectList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-width"/>
      </el-form-item>

      <el-form-item label="策略" prop="policies">
        <el-select
          v-model="form.policies"
          placeholder="请选择"
          class="custom-width"
        >
          <el-option
            v-for="(item, idx) of policyList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm(formRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { type FormRules, type FormInstance, ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { useRegion } from '@/utils/common/region'
import { instanceGroupCreate } from '@/api/java/compute'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  policies: '', // 策略
  regionId: '',
  projectId: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  policies: [{ required: true, message: '请选择策略', trigger: 'blur' }],
  regionId: [{ required: true, message: '请选择区域', trigger: 'blur' }],
  projectId: [{ required: true, message: '请选择项目', trigger: 'blur' }]
})

const policyList = [
  { label: '反亲和性', value: 'anti-affinity' }
]

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
  formEl.validate(valid => {
    if (valid) {
      handleCreate()
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const { resourcePool } = storeToRefs(store.resourceStore)
const { regionList, projectList } = useRegion(form)
const handleCreate = () => {
  const params = {
    name: form.name,
    policies: form.policies,
    resourcePoolId: resourcePool.value.resourcePoolId,
    poolTypeUuid: resourcePool.value.cloudPlatformType,
    regionId: form.regionId,
    projectId: form.projectId,
    vdcId: resourcePool.value.vdcId
  }
  instanceGroupCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('新增成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('新增失败')
    }
  })
}
</script>

<style scoped lang="scss">
.create {
  width: 100%;
  .custom-width {
    width: 100%;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
  }
}
</style>
