<template>
  <div class="create">
    <ideal-horizontal-steps
      class="create-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
      :minus-step="1"
    />

    <create-form v-show="stepsIndex === 1" ref="configRef" />
    <create-confirm v-show="stepsIndex === 2" :config="orderInfo.config" />

    <create-footer
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickCreate="clickCreate"
      @clickSubmit="clickSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import createForm from './components/create-form.vue'
import createConfirm from './components/create-confirm.vue'
import createFooter from './components/create-footer.vue'
import type { FormInstance } from 'element-plus'
import { showLoading, hideLoading } from '@/utils/tool'
import type { IdealSteps } from '@/types'
import { privateMirrorCreate } from '@/api/java/compute'

const stepsIndex = ref(1)
const configRef = ref()

const stepsArray: IdealSteps[] = [{ title: '镜像配置' }, { title: '确认配置' }]

const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.config = configRef.value.form
})
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickCreate = () => {
  if (stepsIndex.value === 3) {
    return
  }
  if (stepsIndex.value === 1) {
    const basicRef = configRef.value.formRef
    checkForm(basicRef)
  }
}
// 校验表单
const checkForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    const basicInfo = configRef.value.form
    if (!basicInfo.protocol) {
      ElMessage.warning('购买前请阅读协议并勾选同意。')
      return
    } else {
      stepsIndex.value++
    }
  })
}
const router = useRouter()
// 提交
const clickSubmit = () => {
  if (stepsIndex.value === 3) {
    return
  }
  const basicInfo = configRef.value.form
  const params = {
    name: basicInfo.name,
    instanceId: basicInfo.instanceId,
    description: basicInfo.description
  }
  showLoading('创建中...')
  privateMirrorCreate(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success(data || '镜像创建中')
        router.push({ path: '/multi-cloud/mirror-serve/index' })
      } else {
        ElMessage.success('创建失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}
:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.create {
  margin: $idealMargin $idealMargin 80px;
  .create-steps {
    margin-bottom: $idealPadding;
  }
}
</style>
