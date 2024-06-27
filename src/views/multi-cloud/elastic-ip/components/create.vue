<template>
  <div class="elastic-ip--create">
    <basic-config v-show="stepsIndex === 1" ref="basicConfigRef">
    </basic-config>

    <confirm-config
      v-show="stepsIndex === 2"
      :basic-info="orderInfo.basic"
      :price="orderInfo.price"
    ></confirm-config>

    <price-info
      ref="priceInfoRef"
      :steps-index="stepsIndex"
      :basic-data="orderInfo.basic"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
      @clickComplete="clickComplete"
    >
    </price-info>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import basicConfig from './basic-config.vue'
import confirmConfig from './confirm-config.vue'
import priceInfo from './price-info.vue'
import store from '@/store'
import { ElMessage } from 'element-plus/es'
import { showLoading, hideLoading, approvalProcess } from '@/utils/tool'
import { eipCreate } from '@/api/java/network'
import { BillingEnum } from '@/utils/enum'
import { useResourcePool } from '@/utils/common/resource'

const { isPrivateHuawei, isPublic, isAliyun } = useResourcePool()

const basicConfigRef = ref()
const priceInfoRef = ref()
const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.basic = basicConfigRef.value.eipForm
})

const isPackage = computed(
  () => orderInfo.basic.billingMode === BillingEnum.PACKAGE
) //是否包年包月

const stepsIndex = ref(1)
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickNext = () => {
  if (stepsIndex.value === 1) {
    const eipFormRef = basicConfigRef.value.eipFormRef
    checkForm(eipFormRef)
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
    orderInfo.price = priceInfoRef.value.price
    stepsIndex.value++
  })
}

const { resourcePool } = store.resourceStore
const commonParams = () => {
  const params = {
    resourcePoolId: resourcePool.resourcePoolId,
    poolTypeUuid: resourcePool.cloudPlatformType,
    regionId: orderInfo.basic.regionId,
    projectId: orderInfo.basic.projectId,
    vdcId: store.userStore.user.vdcId,
    cloudPlatformId: resourcePool.cloudPlatformId
  }
  return params
}

const router = useRouter()
const clickComplete = async () => {
  const params: { [key: string]: any } = {
    eipType: orderInfo.basic.line,
    resourceType: 'EIP',
    type: 'SUBSCRIBE',
    billType: orderInfo.basic.billingMode,
    instanceResourceName: orderInfo.basic.eipName,
    cloudLabelIds: orderInfo.basic.tagIds,
    orderQuantity: orderInfo.basic.eipPurchaseVolume,
    ...commonParams()
  }
  if (isPublic.value) {
    const bandwidth: { [key: string]: any } = {
      size:
        orderInfo.basic.bandwidthType === 'shareBandwidth'
          ? ''
          : orderInfo.basic.bandwidthSize,
      name: orderInfo.basic.bandwidthName,
      chargeMode: orderInfo.basic.bandwidthType
    }
    params.bandwidth = bandwidth
  }
  //包年包月入参
  if (isPackage.value) {
    params.billCycle =
      orderInfo.basic.eipPurchaseDuration < 10 ? 'MONTH' : 'YEAR'
    params.billCycleNum = orderInfo.basic.eipPurchaseDuration
  }
  //阿里云可不传ipVersion及带宽类型
  if (!isAliyun.value) {
    params.ipVersion = orderInfo.basic.openIpv6 ? '6' : '4'
    params.bandwidth.sharetype =
      orderInfo.basic.bandwidthType === 'shareBandwidth' ? 'WHOLE' : 'PER'
  }
  //华为私有云有外部网络参数
  if (isPrivateHuawei.value) {
    params.externalNetName = orderInfo.basic.externalNetwork
  }
  showLoading('创建中...')
  // 请求orderId
  eipCreate(params)
    .then((res: any) => {
      const { code, data } = res
      const orderId: any = data
      if (code === 200) {
        // 根据vdc判断是否走审批，传创建类型，vdcId和订单返回的订单号
        approvalProcess('EIP', store.userStore.user.vdcId, orderId).then(
          (res: any) => {
            if (res.code === 200) {
              router.push({ path: '/multi-cloud/elastic-ip/list' })
            }
          }
        )
      } else {
        ElMessage.error('生成订单失败')
      }
      hideLoading()
    })
    .catch(err => {
      ElMessage.error(err)
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.elastic-ip--create {
  margin: $idealMargin $idealMargin 80px;
  :deep(.el-form) {
    padding: 0 0 8px;
  }
  :deep(.el-card__header) {
    border-bottom: 0;
  }
  .current-config__container {
    border-radius: $circleRadiusSize;
    background-color: $gray1-light;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;
  }
}
</style>
