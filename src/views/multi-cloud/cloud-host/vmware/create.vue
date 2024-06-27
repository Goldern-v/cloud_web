<template>
  <div class="vmware-create">
    <ideal-horizontal-steps
      class="vmware-create-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
    />

    <basic-config
      v-show="stepsIndex === 0"
      ref="basicConfigRef"
      @clickDrawer="clickDrawer"
    />

    <network-high
      v-show="stepsIndex === 1"
      ref="networkConfigRef"
      @clickDrawer="clickDrawer"
    />

    <confirm-config
      v-show="stepsIndex === 2"
      ref="confirmConfigRef"
      :basic-data="orderInfo.basic"
      :high-data="orderInfo.high"
      :network-data="orderInfo.network"
      :quota-data="quotaData"
      @clickStep="clickStep"
    />

    <price-info
      :steps-index="stepsIndex"
      :basic-data="orderInfo.basic"
      :confirm-data="orderInfo.confirm"
      :last-step="2"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
      @clickComplete="clickComplete"
    />
    <question-drawer
      :show-drawer="showDrawer"
      :type="drawerType"
      @update:showDrawer="showDrawer = $event"
    ></question-drawer>
  </div>
</template>

<script setup lang="ts">
import basicConfig from '../components/basic-config.vue'
import networkHigh from './components/network-high.vue'
import priceInfo from '../components/price-info.vue'
import confirmConfig from '../components/confirm-config.vue'
import questionDrawer from '../drawer/index.vue'
import type { FormInstance } from 'element-plus'
import { showLoading, hideLoading } from '@/utils/tool'
import store from '@/store'
import { cloudHostCreate } from '@/api/java/compute'
import { ElMessage } from 'element-plus/es'
import type { IdealSteps } from '@/types'
import { EventEnum, BillingEnum } from '@/utils/enum'
import { queryVdcQuota } from '@/api/java/public'

/**
 * 通用型创建, 满足公有云
 */

const stepsIndex = ref(0)
const stepsArray: IdealSteps[] = [
  { title: '基础配置' },
  { title: '网络和高级配置' },
  { title: '确认配置' }
]

const basicConfigRef = ref()
const networkConfigRef = ref()
const confirmConfigRef = ref()

const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.basic = basicConfigRef.value.form
  orderInfo.network = networkConfigRef.value.dic
  orderInfo.high = {
    cloudHostName: networkConfigRef.value.dic.cloudHostName
  }
  getVdcQuota()
})
// 配额
const quotaData = ref<any[]>([])
const getVdcQuota = () => {
  const params = {
    vdcId: store.userStore.user.vdcId,
    resourceType: 'ECS'
  }
  queryVdcQuota(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        quotaData.value = data
      } else {
        quotaData.value = []
      }
    })
    .catch(_ => {
      quotaData.value = []
    })
}

// 上一步
const clickPrevious = () => {
  if (stepsIndex.value === 0) {
    return
  }
  stepsIndex.value--
}
// 下一步
const clickNext = () => {
  if (stepsIndex.value === 3) {
    return
  }
  if (stepsIndex.value === 0) {
    const basicInfoRef = basicConfigRef.value.formRef
    checkForm(basicInfoRef)
  } else if (stepsIndex.value === 1) {
    const networkInfoRef = networkConfigRef.value.formRef
    checkForm(networkInfoRef)
  } else if (stepsIndex.value === 2) {
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
// 抽屉是否显示
const showDrawer = ref(false)
// 抽屉类型
const drawerType = ref('')
const clickDrawer = (type: string) => {
  drawerType.value = type
  showDrawer.value = true
}

const { projectId, resourcePool, regionId } = storeToRefs(store.resourceStore)

const clickComplete = () => {
  if (stepsIndex.value === 4) {
    return
  }
  const basicInfo = basicConfigRef.value.form
  const networkInfo = networkConfigRef.value.dic
  const confirmInfo = confirmConfigRef.value.form

  if (!confirmInfo.agree) {
    return ElMessage.warning('购买前请阅读协议并勾选同意。')
  }

  const params: { [key: string]: any } = {
    resourcePoolId: resourcePool.value.resourcePoolId, // 资源池id 必须
    cloudPlatformId: resourcePool.value.cloudPlatformId,
    vdcId: store.userStore.user.vdcId,
    resourceType: 'ECS',
    type: 'SUBSCRIBE',
    availableZone: basicInfo.availableZone.value, // 可用区
    billType: basicInfo.billingMode.value, // 收费模式
    count: confirmInfo.count, // 数量
    regionId: regionId.value, // 区域
    projectId: projectId.value,
    description: networkInfo.description.value,
    isAutoRenew: false, // 是否自动续 非必须
    instanceResourceName: networkInfo.cloudHostName.value, // 云主机名称
    compute: {
      imageId: basicInfo.mirror.value, // 镜像ID
      flavorId: basicInfo.currentSpec.value.id, // 规格ID
      name: networkInfo.cloudHostName.value, // 云主机名称
      isAutoRename: false, // 自动命名
      adminPass: networkInfo.securityCode.value, // 密码登录
      userData: '', // 用户数据
      rootVolume: {
        // 系统盘
        volumetype: basicInfo.systemDisk.value, // 数据盘类型
        size: basicInfo.systemDiskSize.value // 数据盘大小
      }
    },
    network: {
      vpcid: networkInfo.vpc.value,
      subnetId: networkInfo.subnet.value
    }
  }
  if (basicInfo.billingMode.value === BillingEnum.PACKAGE) {
    params.billCycle = confirmInfo.buyTime > 11 ? 'YEAR' : 'MONTH' // 包年包月时间单位 计费周期（1 小时；2 天；4 周；8 月； 16 年 ）
    params.billCycleNum =
      confirmInfo.buyTime > 11 ? confirmInfo.buyTime - 11 : confirmInfo.buyTime // 包年包月时间
  }
  // 数据盘数据
  if (basicInfo.dataDisks.value.length) {
    const arr: any = []
    basicInfo.dataDisks.value.forEach((item: any) => {
      const obj = {
        volumetype: item.type,
        size: item.size
      }
      arr.push(obj)
    })
    params.volumes = arr
  }

  showLoading('创建中...')
  cloudHostCreate(params)
    .then((res: any) => {
      const { code, data } = res
      const orderId: any = data
      if (code === 200) {
        emit(EventEnum.success)
      } else {
        ElMessage.success('创建失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
// 点击事件
interface EventEmits {
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
</script>

<style lang="scss" scoped>
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}
:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.vmware-create {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .vmware-create-steps {
    margin-bottom: $idealPadding;
  }
}
</style>
