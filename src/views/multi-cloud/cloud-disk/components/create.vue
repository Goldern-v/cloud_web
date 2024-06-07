<template>
  <div class="cloud-disk-create">
    <ideal-horizontal-steps
      class="cloud-disk-create-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
      :minus-step="1"
    />

    <create-form v-show="stepsIndex === 1" ref="basicConfigRef" />

    <create-confirm v-show="stepsIndex === 2" :info="orderInfo.basic" />

    <div v-if="stepsIndex === 3" class="flex-column complete-container">
      <div>{{ submitMsg }}</div>
      <div>
        页面将于<span>{{ countDown }}</span
        >秒后返回
      </div>
    </div>

    <price-info
      v-if="stepsIndex !== 3"
      :steps-index="stepsIndex"
      :basic-data="orderInfo.basic"
      :cloud-platform-id="cloudPlatformId"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
    >
    </price-info>
  </div>
</template>

<script setup lang="ts">
import createForm from './create-form.vue'
import createConfirm from './create-confirm.vue'
import priceInfo from './price-info.vue'
import store from '@/store'
import { ElMessage } from 'element-plus/es'
import { showLoading, hideLoading } from '@/utils/tool'
import { cloudDiskCreate } from '@/api/java/store'
import type { IdealSteps } from '@/types'
import { approvalProcess } from '@/utils/tool'

const stepsIndex = ref(1)
const stepsArray: IdealSteps[] = [
  { title: '购买云硬盘' },
  { title: '确认信息' },
  { title: '提交申请' }
]

const basicConfigRef = ref()

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
  if (stepsIndex.value === 1) {
    stepsIndex.value++
  } else if (stepsIndex.value === 2) {
    clickComplete()
  }
}

const submitMsg = ref('')
const countDown = ref(5)
const router = useRouter()

const cloudPlatformId = ref('')
const orderInfo: any = reactive({})

const { projectId, regionId, resourcePool } = storeToRefs(store.resourceStore)

onMounted(() => {
  cloudPlatformId.value = resourcePool.value.cloudPlatformId
  getEbsName()
})
const getEbsName = () => {
  orderInfo.basic = basicConfigRef.value.form
  submitMsg.value = `新建云硬盘${orderInfo.basic.ebsName}创建成功`
}
watch(
  () => basicConfigRef.value?.form,
  value => {
    if (value) {
      getEbsName()
    }
  },
  { deep: true }
)

const clickComplete = () => {
  const basicInfo = basicConfigRef.value.form
  const selectCase = basicConfigRef.value.selectCase
  const params: { [key: string]: any } = {
    instanceResourceName: basicInfo.ebsName, // 硬盘名称
    volumeType: basicInfo.dataVolume, // 硬盘类型
    size: basicInfo.dataVolumeSize, // 硬盘大小
    shareable: basicInfo.isShare ? 1 : 0, // 是否为共享磁盘 1为共享盘，0普通云硬盘
    volumeMode: basicInfo.isSCSI ? 'SCSI' : 'VBD', // 磁盘模式 VBD/SCSI 不传默认VBD
    encrypted: basicInfo.isEncrypt ? 1 : 0, // 是否加密 0不加密 1加密
    resourceType: 'EBS', // 资源类型
    type: 'SUBSCRIBE', // 类型
    billType: basicInfo.billType, // 收费模式 PACKAGE包年 ON_DEMAND按需
    resourcePoolId: resourcePool.value.resourcePoolId, // 资源池id
    poolTypeUuid: resourcePool.value.cloudPlatformType, // 资源池类标识
    regionId: regionId.value,
    projectId: projectId.value,
    vdcId: store.userStore.user.vdcId,
    availableZone: basicInfo.availableZone, // 可用区
    cloudPlatformId: resourcePool.value.cloudPlatformId,
    imageId: '', // 镜像ID 指定该参数表示创建云硬盘方式为从镜像创建云硬盘
    backupId: '', // 备份ID 从备份创建云硬盘时为必选
    snapshotId: null, // 快照ID 指定该参数表示创建云硬盘方式为从快照创建云硬盘
    cloudBackup: {} // 云备份
  }
  // 云备份选择
  if (selectCase.isNowBuy) {
    params.cloudBackup.name = basicInfo.cloudBackupPoolName // 存储库名称
    params.cloudBackup.size = basicInfo.cloudBackupPoolSize // 存储库大小
    params.cloudBackup.policyId = basicInfo.backupPolicy // 使用策略ID
  } else if (selectCase.isAlready) {
    params.cloudBackup.uuid = basicInfo.cloudBackupPool // 存储库uuid
    params.cloudBackup.policyId = basicInfo.backupPolicy // 使用策略ID
  }

  // billCycle: 包年包月计费周期类型 包年包月计费周期类型  year 年； month 月； week 周； day 日； 当收费模式 billType = PACKAGE 时，此字段为必填
  // billCycleNum: 包年包月计费周期值 包年包月计费周期  当收费模式 billType = PACKAGE 且 包年包月计费周期类型 billingUnit 不为空时，此字段为必填
  // 包年包月
  if (selectCase.isPackage) {
    // 超过一年
    if (basicInfo.buyTime > 11) {
      params.billCycle = 'YEAR'
      params.billCycleNum = basicInfo.buyTime - 11
    } else {
      params.billCycle = 'MONTH'
      params.billCycleNum = basicInfo.buyTime
    }
  }

  showLoading('创建中...')
  cloudDiskCreate(params)
    .then((res: any) => {
      const { code, data } = res
      const orderId: any = data
      if (code === 200) {
        approvalProcess('EBS', store.userStore.user.vdcId, orderId).then(
          (res: any) => {
            if (res.code === 200) {
              stepsIndex.value++
              timerHandler()
            }
          }
        )
      } else {
        ElMessage.error('创建失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}

// 计时器处理器
const timerHandler = () => {
  const timer = setInterval(() => {
    if (countDown.value > 1) {
      countDown.value--
    } else {
      clearInterval(timer)
      router.push({ path: '/multi-cloud/cloud-disk/list' })
    }
  }, 1000)
}
</script>

<style scoped lang="scss">
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}
:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.cloud-disk-create {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .cloud-disk-create-steps {
    margin-bottom: 20px;
  }
  .complete-container {
    margin: 100px 0;
    align-items: center;
    justify-content: center;
  }
}
</style>
