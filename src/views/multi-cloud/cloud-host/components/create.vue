<template>
  <div class="cloud-host-create">
    <ideal-horizontal-steps
      class="cloud-host-create-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
    />

    <basic-config
      v-show="stepsIndex === 0"
      ref="basicConfigRef"
      @clickDrawer="clickDrawer"
    />

    <network-config
      v-show="stepsIndex === 1"
      ref="networkConfigRef"
      @clickDrawer="clickDrawer"
    />

    <high-config v-show="stepsIndex === 2" ref="highConfigRef" />

    <confirm-config
      v-show="stepsIndex === 3"
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
import basicConfig from './basic-config.vue'
import priceInfo from './price-info.vue'
import networkConfig from './network-config.vue'
import highConfig from './high-config.vue'
import confirmConfig from './confirm-config.vue'
import questionDrawer from '../drawer/index.vue'
import type { FormInstance } from 'element-plus'
import { showLoading, hideLoading } from '@/utils/tool'
import store from '@/store'
import { cloudHostCreate } from '@/api/java/compute'
import { ElMessage } from 'element-plus/es'
import type { IdealSteps } from '@/types'
import { EventEnum, BillingEnum } from '@/utils/enum'
import { queryVdcQuota } from '@/api/java/public'
import { approvalProcess } from '@/utils/tool'
import { useResourcePool } from '@/utils/common/resource'

const { isPublic, isPublicHuawei, isAliyun, isTencent, isCtyun } = useResourcePool()

/**
 * 通用型创建, 满足公有云
 */

const stepsIndex = ref(0)
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
  if (stepsIndex.value === 4) {
    return
  }
  if (stepsIndex.value === 0) {
    const basicInfoRef = basicConfigRef.value.formRef
    checkForm(basicInfoRef)
  } else if (stepsIndex.value === 1) {
    const networkInfoRef = networkConfigRef.value.formRef
    checkForm(networkInfoRef)
  } else if (stepsIndex.value === 2) {
    const highInfoRef = highConfigRef.value.formRef
    checkForm(highInfoRef)
  } else if (stepsIndex.value === 3) {
    const confirmInfoRef = confirmConfigRef.value.formRef
    checkForm(confirmInfoRef)
  }
}
// 校验表单
const checkForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      stepsIndex.value++
    } else {
      console.log('error submit!')
      return false
    }
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
  if (stepsIndex.value === 5) {
    return
  }
  const basicInfo = basicConfigRef.value.form
  const networkInfo = networkConfigRef.value.form
  const highInfo = highConfigRef.value.form
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
    description: highInfo.description,
    isAutoRenew: false, // 是否自动续 非必须
    instanceResourceName: highInfo.cloudHostName, // 云主机名称
    compute: {
      imageId: basicInfo.mirror.value, // 镜像ID
      flavorId: basicInfo.currentSpec.value.id, // 规格ID
      name: highInfo.cloudHostName, // 云主机名称
      isAutoRename: false, // 自动命名
      affinityGroupId: highInfo.cloudHostGroup, // 云服务器组 非必须
      adminPass: highInfo.securityCode, // 密码登录
      keyName: highInfo.keyPair, // 密钥对登录
      userData: '', // 用户数据
      rootVolume: {
        // 系统盘
        volumetype: basicInfo.systemDisk.value, // 数据盘类型
        size: basicInfo.systemDiskSize.value // 数据盘大小
      }
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
        size: item.size,
        name: '',
        shareable: false // 是否为共享磁盘
      }
      arr.push(obj)
    })
    params.volumes = arr
  }
  if (isAliyun.value || isTencent.value || isCtyun.value) {
    params.network = {
      vpcid: networkInfo.vpc,
      subnetId: networkInfo.subnet
    }
  } else {
    params.network = {
      vpcid: networkInfo.vpc,
      nics: [
        {
          subnetId: networkInfo.subnet,
          ipv6Enable: false
        }
      ]
    }
    // 扩展网卡
    if (networkInfo.expand.length) {
      networkInfo.expand.forEach((item: any) => {
        const obj: { [key: string]: string } = {
          subnetId: item.subnet
        }
        // 手动分配ip
        if (item.autoIp === '2') {
          obj.ipAddress = item.manualIp
        }
        params.network.nics.push(obj)
      })
    }
  }
  // 安全组ID
  if (networkInfo.safeGroup.length) {
    const arr: any = []
    networkInfo.safeGroup.forEach((item: string) => {
      const obj = { id: item }
      arr.push(obj)
    })
    params.network.securityGroups = arr
  }

  if (isPublic.value) {
    // 现在购买弹性公网IP
    if (networkInfo.ipMode === '1') {
      const publicip = {
        eip: {
          eipType: networkInfo.line
        }
      }
      params.network.publicip = publicip
      // bandwidth按带宽计费 traffic按流量计费
      if (
        networkInfo.bandwidthType === 'bandwidth' ||
        networkInfo.bandwidthType === 'traffic'
      ) {
        params.network.publicip.eip.bandwidth = {
          chargeMode: networkInfo.bandwidthType,
          size: networkInfo.bandwidthSize
        }
      } else if (networkInfo.bandwidthType === 'shareBandwidth') {
        // 加入共享带宽
        params.network.publicip.eip.bandwidth = {
          id: networkInfo.shareBandwidth
        }
      }
    } else if (networkInfo.ipMode === '2') {
      // 使用已有
      params.network.publicip.id = networkInfo.exitEip
    }
    if (isPublicHuawei.value) {
      // 云备份现在购买
      if (highInfo.cloudBackup === '1') {
        params.cloudBackup = {
          name: highInfo.cloudBackupRepositoryName,
          size: highInfo.repositorySize,
          unit: highInfo.repositoryUnit,
          policyId: highInfo.backupPolicy
        }
      } else if (highInfo.cloudBackup === '2') {
        // 使用已有
        params.cloudBackup = {
          id: highInfo.cloudBackupRepository,
          policyId: highInfo.backupPolicy
        }
      }
    }
  }
  showLoading('创建中...')
  cloudHostCreate(params)
    .then((res: any) => {
      const { code, data } = res
      const orderId: any = data
      if (code === 200) {
        approvalProcess('ECS', store.userStore.user.vdcId, orderId).then(
          (res: any) => {
            if (res.code === 200) {
              emit(EventEnum.success)
            }
          }
        )
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
  (e: 'clickDrawer', v: string): void
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
.cloud-host-create {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .cloud-host-create-steps {
    margin-bottom: $idealPadding;
  }
}
</style>
