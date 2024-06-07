<template>
  <div class="vpc-container--create">
    <ideal-horizontal-steps
      class="vpc-create-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
    />

    <basic-config v-show="stepsIndex === 0" ref="basicConfigRef">
    </basic-config>

    <confirm-config v-show="stepsIndex === 1" :basic-info="orderInfo.basic">
    </confirm-config>

    <success-submit
      v-show="stepsIndex === 2"
      ref="submitRef"
      :submit-msg="submitMsg"
    ></success-submit>
    <div></div>

    <price-info
      v-if="stepsIndex !== 2"
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
    >
    </price-info>
  </div>
</template>

<script setup lang="ts">
import basicConfig from './basic-config.vue'
import confirmConfig from './confirm-config.vue'
import priceInfo from './price-info.vue'
import successSubmit from './success-submit.vue'
import store from '@/store'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import { vpcCreate } from '@/api/java/network'
import type { IdealSteps } from '@/types'
import { useResourcePool } from '@/utils/common/resource'

const basicConfigRef = ref()
const orderInfo: any = reactive({})

const { resourcePool } = store.resourceStore
const { isPrivateHuawei } = useResourcePool()
onMounted(() => {
  orderInfo.basic = basicConfigRef.value.basicInfo
})

const stepsIndex = ref(0)
const stepsArray: IdealSteps[] = [
  { title: '填写虚拟私有云' },
  { title: '确认信息' },
  { title: '提交申请' }
]
const clickPrevious = () => {
  if (stepsIndex.value === 0) {
    return
  }
  stepsIndex.value--
}

const submitRef = ref()
const submitMsg = ref('')

const clickNext = () => {
  if (stepsIndex.value === 2) {
    return
  }
  if (stepsIndex.value === 1) {
    const basicInfo = basicConfigRef.value.basicInfo
    const subnetDtoList = basicInfo.subnetFormData.map((item: any) => {
      return {
        name: item.subnetName,
        description: item.subnetDesc,
        ipVersion: item.openIpv6 ? 'IPV6' : 'IPV4',
        cidr: item.subnetIp4vCidr,
        availableZone: item.availableZone,
        gatewayIp: item.gateway,
        ipv6Enable: item.openIpv6
      }
    })
    let params: any = {
      subnetDtoList,
      name: basicInfo.vpcName,
      cidr: basicInfo.ipv4Cidr,
      cloudLabelIds: basicInfo.tagIds,
      resourcePoolId: resourcePool.resourcePoolId, //资源池id
      poolTypeUuid: resourcePool.cloudPlatformType, //资源池类型
      regionId: basicInfo.regionId, //区域id
      projectId: basicInfo.projectId, //云管项目id
      projectUuid: basicInfo.cloudProjectId, //底层项目id
      vdcId: resourcePool.vdcId // vdc的主键值,
    }
    if (isPrivateHuawei.value) {
      params.externalNetworkUuid = basicInfo.externalNetwork
    } else {
      params.description = basicInfo.vpcDesc
    }
    submitMsg.value = `新建私有云${basicConfigRef.value.basicInfo.vpcName}提交成功`
    showLoading('创建中...')
    vpcCreate(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          ElMessage.success('创建成功')
          stepsIndex.value++
          submitRef.value.startTimer()
        } else {
          ElMessage.error('创建失败')
        }
        hideLoading()
      })
      .catch(_ => {
        hideLoading()
      })
  } else {
    stepsIndex.value++
  }
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

.vpc-container--create {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .vpc-create-steps {
    margin-bottom: 20px;
  }
  .complete-container {
    margin: 100px 0;
    align-items: center;
    justify-content: center;
    img {
      margin-bottom: 20px;
    }
    div {
      line-height: 50px;
    }
  }
}
</style>
