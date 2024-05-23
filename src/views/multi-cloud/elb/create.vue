<template>
  <div class="elb-create-container">
    <div v-show="stepsIndex === 1" class="config-container">
      <basic-config ref="basicConfigRef"> </basic-config>
      <network-config ref="netConfigRef" :basic-data="orderInfo.basic">
      </network-config>
    </div>

    <confirm-config
      v-show="stepsIndex === 2"
      :basic-info="orderInfo"
      :price="orderInfo.price"
    >
    </confirm-config>

    <price-info
      ref="priceInfoRef"
      :steps-index="stepsIndex"
      :basic-data="orderInfo"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
      @clickComplete="clickComplete"
    ></price-info>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import basicConfig from './components/basic-config.vue'
import networkConfig from './components/network-config.vue'
import confirmConfig from './components/confirm-config.vue'
import priceInfo from './components/price-Info.vue'

const basicConfigRef = ref()
const netConfigRef = ref()
const priceInfoRef = ref()

const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.basic = basicConfigRef.value.basicForm
  orderInfo.net = netConfigRef.value.netForm
})

watch(
  () => toRefs(priceInfoRef.value),
  priceInfoRef => {
    orderInfo.price = priceInfoRef.price.value
  },
  { deep: true }
)
const stepsIndex = ref(1)
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickNext = async () => {
  if (stepsIndex.value === 1) {
    const basicFormRef = basicConfigRef.value.basicFormRef
    const netFormRef = basicConfigRef.value.netFormRef
    stepsIndex.value++

    const formRes = await Promise.all([])
  }
}

const validate: any = ref(null)
// 校验表单
const checkForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  return await formEl.validate((valid: any) => {
    stepsIndex.value++
  })
}

const clickComplete = () => {}
</script>

<style scoped lang="scss">
.elb-create-container {
  margin: $idealMargin $idealMargin 80px;
  .skip-text {
    font-size: $defaultFontSize;
  }
  :deep(.el-form) {
    padding: 0px;
  }
}
</style>
