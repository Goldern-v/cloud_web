<template>
  <div class="budget">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="budget-form"
    >
      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-text">预算配置</div>
        <div class="ideal-tip-text">
          您可以为VDC配置整体或个人预算，留空为无限制。当预算用完后，将根据您配置的预算策略对付费资源和申请进行控制。
        </div>
      </div>

      <el-form-item label="重置周期" prop="cycle">
        <el-select
          v-model="form.cycle"
          class="input-width"
          placeholder="请选择"
        >
          <el-option
            v-for="item in cycleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级预算">
        <el-input
          v-model="form.parentBudget"
          class="input-width"
          disabled
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="总预算" prop="budget">
        <el-input
          v-model="form.budget"
          class="input-width"
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="剩余预算">
        <el-input
          v-model="form.remainder"
          class="input-width"
          disabled
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="告警阈值" prop="alarmThreshold">
        <el-input
          v-model="form.alarmThreshold"
          class="input-width"
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="预算策略" prop="policy">
        <el-radio-group v-model="form.policy">
          <el-radio label="NOT_ALLOWED_CREATE"
            >预算使用完后不允许新建资源</el-radio
          >
          <el-radio label="AUTO_SHUTDOWN"
            >预算使用完已付费资源将自动关机</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('save')
      }}</el-button>
      <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import {
  getVdcParentBudgetApi,
  addVdcBudgetApi,
  editVdcBudgetApi,
  getCurrentVdcBudgetApi
} from '@/api/java/business-center'

const { t } = useI18n()
onMounted(() => {
  getVdcParentBudget()
  getCurrentVdcBudget()
})
// 预算和审批配置
const getVdcParentBudget = async () => {
  const res: any = await getVdcParentBudgetApi(vdcId)
  if (res.code === 200) {
    const { data } = res
    form.parentBudget = data ? res.data.budget : 0
  }
}

const editMode = ref(false) //判断更新还是新增预算
//获取当前vdc配额信息
const currentVdcBudget: any = ref({})
const getCurrentVdcBudget = async () => {
  const res: any = await getCurrentVdcBudgetApi({ vdcId })
  if (res.code === 200) {
    const { data } = res
    currentVdcBudget.value = data
    editMode.value = data ? true : false
    form.cycle = data?.cycle
    form.budget = data?.budget
    form.remainder = data?.remainder
    form.alarmThreshold = data?.alarmThreshold
  }
}
// 路由
const route = useRoute()
const vdcId = route.query.id
const vdcCode = route.query.code

const formRef = ref<FormInstance>()
const form = reactive({
  remainder: '',
  cycle: '',
  parentBudget: 0, // 有则编辑无则新增
  budget: '',
  alarmThreshold: '',
  policy: 'NOT_ALLOWED_CREATE',
  vdcId,
  vdcCode
})
const rules = reactive<FormRules>({
  budget: [{ required: true, message: '总预算不能为空', trigger: 'blur' }],
  cycle: [{ required: true, message: '重置周期不能为空', trigger: 'blur' }],
  alarmThreshold: [
    { required: true, message: '告警阈值不能为空', trigger: 'blur' }
  ],
  policy: [{ required: true, message: '预算策略不能为空', trigger: 'blur' }]
})
const cycleList: any = ref([
  { label: '无', value: 'FOREVER' },
  { label: '年', value: 'YEAR' },
  { label: '月', value: 'MONTH' },
  { label: '周', value: 'WEAK' }
])
const router = useRouter()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (editMode.value) {
      editVdcBudget()
    } else {
      addVdcBudget()
    }
  })
}
const addVdcBudget = () => {
  const res: any = addVdcBudgetApi(form)
  res.then((data: any) => {
    if (res.code === 200) {
      ElMessage.success('保存成功')
      router.push({
        path: '/business-center/organization-manage/vdc-manage/list'
      })
    } else {
      ElMessage.error('保存失败')
    }
  })
}
const editVdcBudget = () => {
  const params: any = Object.assign({ id: currentVdcBudget.value?.id }, form)
  delete params.parentBudget
  delete params.remainder
  const res: any = editVdcBudgetApi(params)
  res.then((data: any) => {
    if (data.code === 200) {
      ElMessage.success('保存成功')
      router.push({
        path: '/business-center/organization-manage/vdc-manage/list'
      })
    } else {
      ElMessage.error(data.msg || '保存失败')
    }
  })
}
</script>
<style lang="scss" scoped>
.budget {
  width: 100%;
  .budget-form {
    padding: 20px;
    background-color: white;
    .input-width {
      width: 300px;
    }
    .header__title {
      background-color: var(--el-color-primary-light-9);
      line-height: $headerContainerHeight;
      height: $headerContainerHeight;
      align-items: center;
      margin-bottom: 10px;
      :deep(.el-divider--vertical) {
        border-left: 2px var(--el-color-primary) solid;
      }
      .header__title-text {
        font-size: 16px;
        font-weight: 500;
        color: #000000;
        margin-right: 10px;
      }
    }
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
