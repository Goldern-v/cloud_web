<template>
  <div class="expand">
    <expand-form v-show="stepsIndex === 1" ref="basicConfigRef"/>
    <expand-confirm v-show="stepsIndex === 2" :basic-data="orderInfo.basic"/>
    <div v-if="stepsIndex === 3" class="flex-column complete-container">
      <div>{{ submitMsg }}</div>
      <div>
        页面将于<span>{{ countDown }}</span
        >秒后返回
      </div>
    </div>

    <price-info
      :steps-index="stepsIndex"
      :basic-data="orderInfo.basic"
      :cloud-platform-id="detail?.cloudResourcePool?.cloudPlatform?.id"
      order-type="VARIATION"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
    >
    </price-info>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import expandForm from './components/expand-form.vue'
import expandConfirm from './components/expand-confirm.vue'
import priceInfo from './components/price-info.vue'
import { showLoading, hideLoading } from '@/utils/tool'
import { cloudDiskExpand } from '@/api/java/store'

const route = useRoute()
const detail = JSON.parse(route.query.data as any)

const basicConfigRef = ref()
const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.basic = Object.assign(basicConfigRef.value.form, detail)
  getEbsName()
})

const submitMsg = ref('')
const getEbsName = () => {
  orderInfo.basic = basicConfigRef.value.form
  submitMsg.value = `云硬盘${orderInfo.basic.name}扩容成功`
}
watch(() => basicConfigRef.value?.form, value => {
  if (value) {
    getEbsName()
  }
},{ deep: true })

const stepsIndex = ref(1)
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickNext = () => {
  if (stepsIndex.value === 3) {
    return
  }
  if (stepsIndex.value === 2) {
    handleExpand()
  }
  stepsIndex.value++
}
const handleExpand = () => {
  const basicInfo = basicConfigRef.value.form
  const params = {
    id: detail.id, // 云硬盘id
    uuid: detail.uuid, // 云硬盘uuid
    volumeType: detail.volumeType, // 云硬盘类型
    size: basicInfo.targetSize, // 扩容后最新大小
    billType: detail.billType, // 计费类型 PACKAGE包年包月 ON_DEMAND按需
    resourceType: 'EBS',
    type: 'VARIATION',
    billResourceId: detail.billResourceId,
    resourcePoolId: detail.resourcePoolId,
    regionId: detail.regionId,
    projectId: detail.projectId,
    vdcId: detail.vdcId,
    availableZone: detail.availableZone,
    instanceResourceName: detail.name
  }

  showLoading('扩容中...')
  cloudDiskExpand(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('生成订单成功，请等待审批')
      } else {
        ElMessage.success('创建失败')
      }
      hideLoading()
      timerHandler()
    })
    .catch(_ => {
      hideLoading()
      timerHandler()
    })
}

const countDown = ref(5)
const router = useRouter()
// 计时器处理器
const timerHandler = () => {
  const timer = setInterval(() => {
    if (countDown.value > 1) {
      countDown.value--
    } else {
      router.back()
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped lang="scss">
.expand {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .complete-container {
    margin: 100px 0;
    align-items: center;
    justify-content: center;
  }
}
</style>
