<template>
  <el-footer :class="showSidebar ? 'price-footer' : 'price-footer-small'">
    <div class="flex-row price-footer-box">
      <div class="flex-row price-footer-box--item">
        <div>配置费用：</div>
        <div class="show-price">
          ¥{{ price.toFixed(2) }}元{{ isPackage ? '' : '/小时' }}
        </div>
        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="配置费用"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </div>

      <div class="flex-row price-footer-box--item">
        <el-button
          v-if="stepsIndex === 2"
          type="primary"
          @click="handlePrevious"
          >上一步</el-button
        >
        <el-button v-if="stepsIndex !== 3" type="primary" @click="handleNext">{{
          submitBtn
        }}</el-button>
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts" name="priceInfo">
import store from '@/store'
import { BillingEnum } from '@/utils/enum'
import { queryInquiry } from '@/api/java/public'

interface PriceInfo {
  stepsIndex?: number
  basicData?: any
  orderType?: string // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
  cloudPlatformId?: string // 云平台id 创建时是弹框选择 扩容时是列表数据里的
}

const props = withDefaults(defineProps<PriceInfo>(), {
  stepsIndex: 1,
  basicData: () => ({}),
  orderType: 'SUBSCRIBE',
  cloudPlatformId: ''
})

const submitBtn = ref('立即创建')
onMounted(() => {
  if (props.orderType === 'SUBSCRIBE') {
    submitBtn.value = '立即创建'
  } else if (props.orderType === 'VARIATION') {
    submitBtn.value = '立即扩容'
  }
})

// 包年包月
const isPackage = ref(false)
watch(
  () => props.basicData.billType,
  value => {
    if (value === BillingEnum.PACKAGE) {
      isPackage.value = true
    } else if (value === BillingEnum.ON_DEMAND) {
      isPackage.value = false
    }
  }
)

const showSidebar = computed(() => store.appStore.sidebarOpened)

const price = ref(0)
// 监听询价接口用到的传参数据
watch(
  () => [
    props.basicData.billType,
    props.basicData.dataVolume,
    props.basicData.dataVolumeSize,
    props.basicData.buyTime,
    props.basicData.targetSize
  ],
  value => {
    getInquiry()
  },
  {
    deep: true
  }
)

// 询价
const getInquiry = () => {
  if (!props.cloudPlatformId) {
    return
  }

  let params = {}
  if (props.orderType === 'SUBSCRIBE') {
    params = subscribeParams()
  } else if (props.orderType === 'VARIATION') {
    params = variationParams()
  }

  queryInquiry(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        price.value = data.finalPrices
        store.commonStore.setPrice(data.finalPrices)
      } else {
        price.value = 0
      }
    })
    .catch(_ => {
      price.value = 0
    })
}
// 公共参数
const commonParams = (): { [key: string]: any } => {
  let params: { [key: string]: any } = {
    cloudPlatformId: props.cloudPlatformId, // 云平台类型id
    resourceType: 'EBS', // 云资源类型
    billType: props.basicData?.billType, // 计费模式
    itemsList: [
      {
        code: 'basic_price',
        specs: '1'
      }
    ], // 计费项列表
    orderType: props.orderType // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
  }

  if (props.basicData.billType === BillingEnum.PACKAGE) {
    params.billCycle = 'MONTH'
    params.cycleNum = props.basicData?.buyTime
    if (props.basicData.buyTime > 11) {
      params.billCycle = 'YEAR'
      params.cycleNum = props.basicData?.buyTime - 11
    }
  }
  return params
}
// 订购询价
const subscribeParams = (): { [key: string]: any } => {
  let params = commonParams()
  params.itemsList.push({
    code: props.basicData?.dataVolume,
    specs: props.basicData?.dataVolumeSize
  })
  return params
}
// 变配询价
const variationParams = (): { [key: string]: any } => {
  let params = commonParams()
  params.itemsList.push({
    code: props.basicData?.volumeType,
    specs: props.basicData?.targetSize
  })
  params.resourceId = props.basicData?.billResourceId
  return params
}

// 方法
enum EventType {
  previous = 'clickPrevious',
  next = 'clickNext',
  complete = 'clickComplete'
}
interface EventEmits {
  (e: EventType.previous): void
  (e: EventType.next): void
  (e: EventType.complete): void
}
const emit = defineEmits<EventEmits>()
// 上一步
const handlePrevious = () => {
  emit(EventType.previous)
}
// 下一步
const handleNext = () => {
  emit(EventType.next)
}
// 完成
const handleComplete = () => {
  emit(EventType.complete)
}
</script>

<style lang="scss" scoped>
$bottomHeight: 60px;
.price-footer,
.price-footer-small {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 5px 5px 17px 9px #e5e9ea;
  text-align: center;
  overflow: hidden;
  height: $bottomHeight;
  line-height: $bottomHeight;
  .price-footer-box {
    justify-content: space-between;
    align-items: center;
    .price-footer-box--item {
      justify-content: flex-start;
      align-items: center;
      .show-price {
        color: var(--el-color-primary);
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }
  .left {
    float: left;
    margin: 30px 20px;
    color: #000;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    span {
      vertical-align: baseline;
    }
    .num-units {
      margin: 0 10px;
    }
  }
  .right {
    float: right;
    margin: 30px 20px;
  }
}
.price-footer-small {
  width: calc(100% - $sidebarSmallWidth);
  left: $sidebarSmallWidth;
}
:deep(.el-button--primary) {
  --el-button-text-color: white;
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: white;
  --el-button-hover-text-color: white;
  &:hover,
  &:focus {
    background-color: var(--el-color-primary);
    border-color: var(--el-border-color-light);
  }
}
</style>
