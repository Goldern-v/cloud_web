<template>
  <el-footer height="60px" :class="showSidebar ? 'price-footer':'price-footer-small'">
    <div class="flex-row price-footer-box">
      <div class="flex-row price-footer-box--item">
        <div>配置费用：</div>
        <div class="show-price">
          ¥{{ price.toFixed(2) }}元{{ !isPackage ? '/小时' : '' }}
        </div>

        <svg-icon icon="question-icon" @click="handleQuestion"></svg-icon>
      </div>

      <div class="flex-row price-footer-box--item">
        <el-button
          v-if="stepsIndex !== 1"
          type="primary"
          @click="handlePrevious"
          >上一步</el-button
        >
        <el-button v-if="stepsIndex === 1" type="primary" @click="handleNext"
          >立即购买</el-button
        >
        <el-button
          v-if="stepsIndex === 2"
          type="primary"
          @click="handleComplete"
          >提交</el-button
        >
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts" name="priceInfo">
// import { timeValues } from './common'
import store from '@/store'
import { BillingEnum } from '@/utils/enum'
import { queryInquiry } from '@/api/java/public'

interface PriceInfo {
  stepsIndex?: number
  basicData?: any
  confirmData?: any
}

const props = withDefaults(defineProps<PriceInfo>(), {
  stepsIndex: 1,
  basicData: () => ({}),
  confirmData: () => ({})
})

const showSidebar = computed(() => store.appStore.sidebarOpened)

// 监听询价接口用到的传参数据
watch(
  () => [
    props.basicData.billingMode,
    props.basicData.eipPurchaseDuration,
    props.basicData.bandwidthSize
  ],
  value => {
    // getInquiry()
  },
  {
    deep: true
  }
)

const isPackage = computed(() => props.basicData.billingMode === BillingEnum.PACKAGE) //是否包年包月

const { resourcePoolInfo } = storeToRefs(store.resourceStore)

const price = ref(0)
// 询价
const getInquiry = () => {
  if (!resourcePoolInfo?.value || !props.basicData?.billingMode) {
    return
  }
  const item = {
    code: props.basicData.line,
    specs: props.basicData.bandwidthSize
  }

  let params: { [key: string]: any } = {
    billCycle: isPackage.value
      ? props.basicData.eipPurchaseDuration < 10
        ? 'MONTH'
        : 'YEAR'
      : '', //计费周期
    billType: props.basicData.billingMode, //计费模式
    cloudPlatformId: resourcePoolInfo.value.cloudAccountId, // 云平台类型id
    itemsList: [item],
    cycleNum: isPackage.value ? props.basicData.eipPurchaseDuration : '',
    name: props.basicData.eipName,
    orderType: 'SUBSCRIBE',
    projectId: store.resourceStore.projectId,
    resourcePoolId: resourcePoolInfo.value.id,
    resourceType: 'EIP',
    vdcId: store.userStore.user.vdcId
  }
  queryInquiry(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        price.value = data.finalPrices
      } else {
        price.value = 0
      }
    })
    .catch(_ => {
      price.value = 0
    })
}

const num = ref(1)
const timeValue = ref('')

enum EventType {
  previous = 'clickPrevious',
  next = 'clickNext',
  complete = 'clickComplete',
  question = 'clickQuestion'
}
interface EventEmits {
  (e: EventType.previous): void
  (e: EventType.next): void
  (e: EventType.complete): void
  (e: EventType.question): void
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
const handleQuestion = () => {
  emit(EventType.question)
}

defineExpose({
  price
})
</script>

<style lang="scss" scoped>
.price-footer, .price-footer-small {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 0 5px 17px 9px #e5e9ea;
  text-align: center;
  overflow: hidden;
  .custom-margin-right {
    margin-right: 10px;
  }
  .price-footer-box {
    height: 60px;
    line-height: 60px;
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
</style>
