<template>
  <div class="bare-metal-server">
    <ideal-horizontal-steps
      class="bare-metal-server-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
      :minus-step="1"
    />

    <basic-config v-show="stepsIndex === 1" ref="basicConfigRef" />

    <network-config v-show="stepsIndex === 2" ref="networkConfigRef" />

    <high-config v-show="stepsIndex === 3" ref="highConfigRef" />

    <confirm-config
      v-show="stepsIndex === 4"
      ref="confirmConfigRef"
      :basic-data="orderInfo.basic"
      :high-data="orderInfo.high"
      :network-data="orderInfo.network"
      @clickStep="clickStep"
    />

    <price-info
      :steps-index="stepsIndex"
      :basic-data="orderInfo.basic"
      :confirm-data="orderInfo.confirm"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
      @clickComplete="clickComplete"
    />
  </div>
</template>

<script setup lang="ts">
import basicConfig from './components/basic-config.vue'
import priceInfo from './components/price-info.vue'
import networkConfig from './components/network-config.vue'
import highConfig from './components/high-config.vue'
import confirmConfig from './components/confirm-config.vue'
import type { FormInstance } from 'element-plus'
import { showLoading, hideLoading } from '@/utils/tool'
import store from '@/store'
import { ElMessage } from 'element-plus/es'
import type { IdealSteps } from '@/types'

const stepsIndex = ref(1)
const stepsArray: IdealSteps[] = [
  { title: '基础配置' },
  { title: '网络配置' },
  { title: '高级配置' },
  { title: '确认配置' }
]

const basicConfigRef = ref()
const networkConfigRef = ref()
const highConfigRef = ref()
const confirmConfigRef = ref()

const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.basic = basicConfigRef.value.form
  orderInfo.network = networkConfigRef.value.form
  orderInfo.high = highConfigRef.value.form
  orderInfo.confirm = confirmConfigRef.value.form
})

const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickNext = () => {
  if (stepsIndex.value === 5) {
    return
  }
  if (stepsIndex.value === 1) {
    const basicInfoRef = basicConfigRef.value.formRef
    checkForm(basicInfoRef)
  } else if (stepsIndex.value === 2) {
    const networkInfoRef = networkConfigRef.value.formRef
    checkForm(networkInfoRef)
  } else if (stepsIndex.value === 3) {
    const highInfoRef = highConfigRef.value.formRef
    checkForm(highInfoRef)
  } else if (stepsIndex.value === 4) {
    const confirmInfoRef = confirmConfigRef.value.formRef
    checkForm(confirmInfoRef)
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
    console.log('submit!')
    stepsIndex.value++
  })
}

const clickStep = (index: number) => {
  stepsIndex.value = index
}

const { resourcePoolInfo, projectId } = storeToRefs(store.resourceStore)

const clickComplete = () => {
  if (stepsIndex.value === 5) {
    return
  }
  const basicInfo = basicConfigRef.value.form
  const networkInfo = networkConfigRef.value.form
  const highInfo = highConfigRef.value.form
  const confirmInfo = confirmConfigRef.value.form

  const params: { [key: string]: any } = {}

  // showLoading('创建中...')
  // cloudHostCreate(params)
  //   .then((res: any) => {
  //     const { code, data } = res
  //     if (code === 200) {
  //       console.log(data)
  //       ElMessage.success('创建成功')
  //       submitOrder(data.orderId)
  //     } else {
  //       ElMessage.success('创建失败')
  //     }
  //     hideLoading()
  //   })
  //   .catch(_ => {
  //     hideLoading()
  //   })
}
const route = useRouter()
// 提交订单
const submitOrder = (orderId: string) => {
  // showLoading('提交订单中...')
  // cloudHostCommit(orderId)
  //   .then((res: any) => {
  //     const { code } = res
  //     if (code === 200) {
  //       route.push({ path: '/multi-cloud/cloud-host/list' })
  //     } else {
  //       hideLoading()
  //     }
  //   })
  //   .catch(_ => {
  //     hideLoading()
  //   })
}
</script>

<style lang="scss" scoped>
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}
:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.bare-metal-server {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .bare-metal-server-steps {
    margin-bottom: 20px;
  }
}
</style>
