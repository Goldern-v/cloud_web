<template>
  <div>
    <el-card class="ideal-large-margin-top">
      <ideal-detail-info
        :label-array="labelArray"
        label-position="left"
        :show-colon="false"
        :detail-info="eipInfo"
        @edit-info="editInfo"
      >
        <template #status>
          <div class="flex-row" style="align-items: center">
            <svg-icon
              icon="refresh-icon"
              class="ideal-svg-margin-right"
              style="color: var(--el-color-primary)"
              @click="refresh"
            ></svg-icon>
            <span>{{ eipInfo.statusText }}</span>
          </div>
        </template>
      </ideal-detail-info>
    </el-card>

    <el-card v-if="bindInstanceType" class="ideal-large-margin-top">
      <p class="basic-info-tile">已绑定实例</p>
      <ideal-detail-info
        :label-array="instanceLabel"
        label-position="left"
        :show-colon="false"
        :detail-info="instanceInfo"
        @to-instance="toInstance"
      >
        <template #status>
          <div class="flex-row" style="align-items: center">
            <svg-icon
              icon="refresh-icon"
              class="ideal-svg-margin-right"
            ></svg-icon>
            <span>{{ eipInfo.statusText }}</span>
          </div>
        </template>
        <template #vpc>
          <div class="ideal-theme-text">
            {{ instanceInfo.subnet?.vpcName }}
          </div>
        </template>
        <template #subnet>
          <div class="ideal-theme-text">{{ instanceInfo.subnet?.name }}</div>
        </template>
      </ideal-detail-info>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { showLoading, hideLoading } from '@/utils/tool'
import {
  queryEipRelevanceInstanceInfo,
  queryEipDetail,
  editEip
} from '@/api/java/network'
import { RESOURCE_STATUS } from '@/utils/dictionary'
import { ElMessage } from 'element-plus'

const labelArray: any = ref([
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '类型', prop: 'eipType' },
  { label: '创建时间', prop: 'createDate' },
  { label: 'ID', prop: 'id', isCopy: true },
  { label: '状态', prop: 'status', useSlot: true }
])
const instanceLabel: any = ref([])

const ecsLabel = [
  { label: '实例名称', prop: 'instanceName', isSkip: true },
  { label: '虚拟私有云', prop: 'vpcName', isSkip: true },
  { label: '实例ID', prop: 'instanceUuid', isCopy: true },
  { label: '子网', prop: 'subnetName', isSkip: true },
  { label: '实例类型', prop: 'typeCN' },
  { label: '状态', prop: 'statusText' },
  { label: '可用区', prop: 'availableZone' },
  { label: '已绑定网卡', prop: 'fixedIp' }
]
const assistNicLabel = [
  { label: '服务地址', prop: 'fixedIp' },
  { label: '虚拟私有云', prop: 'vpc', useSlot: true },
  { label: '实例ID', prop: 'nicUuid' },
  { label: '子网', prop: 'subnet', useSlot: true },
  { label: '实例类型', prop: 'bindInstanceType' },
  { label: 'VLAN', prop: '' }
]
const route = useRoute()
const id = route.query?.id as string
const uuid = route.query?.uuid as string
const bindInstanceType = route.query?.bindInstanceType //绑定实例类型
const cloudPlatformCategoryCode = route.query
  ?.cloudPlatformCategoryCode as string //云类别
const cloudPlatformTypeCode = route.query?.cloudPlatformTypeCode as string //云类型

const isPrivateHuawei = computed(
  () =>
    RegExp(/PRIVATE/).test(cloudPlatformCategoryCode) &&
    RegExp(/HUAWEI_CLOUD/).test(cloudPlatformTypeCode)
)

onMounted(() => {
  queryEipInfo()
  if (bindInstanceType) {
    queryInstanceInfo()
    switch (bindInstanceType) {
      case 'ECS':
        instanceLabel.value = ecsLabel
        break
      case 'BACKUP_NIC':
        instanceLabel.value = assistNicLabel
        break
      default:
        instanceLabel.value = []
        break
    }
  }
  if (isPrivateHuawei.value) {
    labelArray.value.splice(3, 0, {
      label: '名称',
      prop: 'name',
      isEdit: false
    })
  } else {
    labelArray.value.splice(3, 0, {
      label: '名称',
      prop: 'name',
      isEdit: true
    })
  }
})

const commonParams = () => {
  const { resourcePoolId, regionId, projectId } = eipInfo.value
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}
//弹性Ip详细信息
const eipInfo: any = ref({})
const queryEipInfo = () => {
  queryEipDetail({ id }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      data.statusText = data.status ? RESOURCE_STATUS[data.status] : ''
      data.createDate = data.createTime?.date
      eipInfo.value = data
    } else {
      eipInfo.value = {}
    }
  })
}

const refresh = () => {
  queryEipInfo()
}

const editInfo = (val: any, config: any) => {
  const params = {
    uuid: val.uuid,
    name: val.name,
    ...commonParams()
  }
  showLoading('更新中...')
  editEip(params)
    .then((res: any) => {
      const { code, data, msg } = res
      if (code === 200) {
        ElMessage.success(data)
        config.showEdit = false
        queryEipInfo()
      } else {
        ElMessage.error(msg)
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}

const instanceInfo: any = ref({})
//弹性Ip绑定实例信息
const queryInstanceInfo = () => {
  queryEipRelevanceInstanceInfo({ uuid }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      if (bindInstanceType === 'ECS') {
        data.statusText = RESOURCE_STATUS[data.status.toUpperCase()]
      }
      instanceInfo.value = data
    } else {
      instanceInfo.value = {}
    }
  })
}

const router = useRouter()
const toInstance = (val: string) => {
  //跳转云主机
  if (val === 'instanceName') {
    router.push({
      path: '/multi-cloud/cloud-host/detail',
      query: {
        uuid: instanceInfo.value?.instanceUuid,
        cloudCategory: cloudPlatformCategoryCode,
        cloudType: cloudPlatformTypeCode
      }
    })
  } else if (val === 'vpcName' || val === 'vpc') {
    router.push({
      path: '/multi-cloud/cloud-host/detail',
      query: {
        id: instanceInfo.value?.vpcId,
        cloudPlatformTypeCode,
        cloudPlatformCategoryCode
      }
    })
  } else if (val === 'subnetName' || val === 'subnet') {
    router.push({
      path: '/multi-cloud/subnet/detail',
      query: {
        id: instanceInfo.value?.subnetId,
        cloudPlatformTypeCode,
        cloudPlatformCategoryCode
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.basic-info-tile {
  font-size: $mediumFontSize;
  font-weight: 500;
  margin: 0 20px 20px;
}
</style>
