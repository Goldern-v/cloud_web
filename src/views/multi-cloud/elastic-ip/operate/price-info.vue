<template>
  <el-footer height="60px" class="price-footer">
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
        <el-button
          v-if="stepsIndex === 1"
          type="primary"
          :disabled="nextDisabled"
          @click="handleNext"
          >下一步</el-button
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
import { resourceTypeEnum, BillingEnum } from '@/utils/enum'
import { queryInquiry } from '@/api/java/public'

interface PriceInfo {
  detailInfo: any
  stepsIndex?: number
  modifiedData?: any //变更后带宽数据
  nextDisabled: boolean //是否禁用下一步
}

const props = withDefaults(defineProps<PriceInfo>(), {
  detailInfo: () => ({}),
  stepsIndex: 1,
  modifiedData: () => ({}),
  nextDisabled: false
})

const route = useRoute()
// const eipInfo = JSON.parse(route.query.data as any) // 弹性IP信息
const isPackage = computed(
  () => props.detailInfo.billType === BillingEnum.PACKAGE
) //弹性IP是否包年包月

// 监听询价接口用到的传参数据
watch(
  () => [props.modifiedData.billingMode, props.modifiedData.bandwidthSize],
  value => {
    getInquiry()
  },
  {
    deep: true
  }
)

const price = ref(0)
// 询价
const getInquiry = () => {
  const item = {
    code: props.detailInfo.eipType,
    specs: props.modifiedData.bandwidthSize
  }

  let params: { [key: string]: any } = {
    billType: props.detailInfo.billType, //计费模式
    // cloudPlatformId: resourcePoolInfo.value.cloudAccountId, // 云平台类型id
    itemsList: [item],
    billCycle: isPackage.value
      ? props.detailInfo.billCycle < 10
        ? 'MONTH'
        : 'YEAR'
      : '', //计费周期
    cycleNum: isPackage.value ? props.detailInfo.cycleNum : '', //订购时长
    name: props.detailInfo.name,
    orderType: 'VARIATION', // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
    projectId: props.detailInfo.projectId,
    resourcePoolId: props.detailInfo.resourcePoolInfo,
    resourceType: resourceTypeEnum.EIP,
    vdcId: props.detailInfo.vdcId,
    resourceId: props.detailInfo.billResourceId
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
.price-footer {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 5px 5px 17px 9px #e5e9ea;
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
</style>
