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
        <el-button v-if="stepsIndex === 1" type="primary" @click="handleNext"
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
// 监听询价接口用到的传参数据
watch(
  () => [
    props.basicData.billingMode,
    props.basicData.currentSpec,
    props.basicData.systemDisk,
    props.basicData.systemDiskSize,
    props.basicData.dataDisks,
    props.confirmData.buyTime
  ],
  value => {
    console.log('---------', value)
    getInquiry()
  },
  {
    deep: true
  }
)

const isPackage = ref(false)
watch(
  () => props.basicData.billingMode,
  value => {
    if (value === BillingEnum.PACKAGE) {
      isPackage.value = true
    } else if (value === BillingEnum.ON_DEMAND) {
      isPackage.value = false
    }
  }
)

const { resourcePoolInfo } = storeToRefs(store.resourceStore)

const price = ref(0)
// 询价
const getInquiry = () => {
  if (
    !resourcePoolInfo.value ||
    !props.basicData.billingMode ||
    !props.basicData.currentSpec ||
    !props.basicData.systemDiskSize
  ) {
    return
  }
  const params: { [key: string]: any } = {
    cloudPlatformId: resourcePoolInfo.value.cloudPlatformId, // 云平台类型id
    resourceType: 'ECS', // 云资源类型
    billType: props.basicData.billingMode, // 计费模式
    itemsList: [
      {
        code: 'basic_price',
        specs: '1'
      },
      {
        code: props.basicData.systemDisk,
        specs: props.basicData.systemDiskSize // 系统盘大小
      },
      {
        code: 'ram', // 实例内存
        specs: props.basicData.currentSpec.ram
      },
      {
        code: 'vcpus', // 实例规格 核数
        specs: props.basicData.currentSpec.vcpus
      }
    ], // 计费项列表
    orderType: 'SUBSCRIBE' // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
  }
  // 数据盘
  if (props.basicData.dataDisks?.length) {
    const arr: any = []
    props.basicData.dataDisks.forEach((item: any) => {
      const obj = {
        code: item.type,
        specs: item.size
      }
      arr.push(obj)
    })
    const ebsSpecs = {
      resourceType: 'EBS',
      itemsList: arr
    }
    params.pricesList = ebsSpecs // 例如创建云主机时的云硬盘和弹性ip等 附属资源规格信息
  }
  if (props.basicData.billingMode === BillingEnum.PACKAGE) {
    params.billCycle = 'MONTH'
    params.cycleNum = props.confirmData.buyTime
    if (props.confirmData.buyTime > 11) {
      params.billCycle = 'YEAR'
      params.cycleNum = props.confirmData.buyTime - 11
    }
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
</script>

<style lang="scss" scoped>
.price-footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
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
</style>
