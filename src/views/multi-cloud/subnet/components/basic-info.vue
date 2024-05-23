<template>
  <div class="basic-info">
    <div class="flex-row basic-info__head">
      <div class="flex-column basic-info__head-img">
        <img class="basic-info__head-img-box" src="@/assets/detail-info.png" />
        <div class="basic-info__head-title">{{ detailInfo.name }}</div>
      </div>

      <el-divider direction="vertical" />

      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="detailInfo"
        class="basic-info__content"
        @edit-info="editInfo"
        @to-instance="toInstance"
      >
        <template #ipv6>
          <div>
            <span>{{ detailInfo.ipv6Gateway || '--' }}</span>
            <span
              v-if="detailInfo.ipv6Enable === false"
              class="ideal-theme-text"
              @click="enableIpv6"
            >
              开启IPv6
            </span>
          </div>
        </template>
      </ideal-detail-info>
    </div>

    <el-tabs
      v-model="activeName"
      class="basic-info__tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]" :detail-info="detailInfo"></component>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="detailInfo"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import cloudHost from './cloud-host.vue'
import usedIp from './used-ip.vue'
import virtualIp from './virtual-ip.vue'
import { querySubnetDetail, subnetEdit } from '@/api/java/network'
import { RESOURCE_STATUS } from '@/utils/dictionary'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'

// 详情label
const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: '网络ID', prop: 'id', isCopy: true },
  { label: '子网网段(IPv4)', prop: 'cidr', isCopy: true },
  { label: '子网网段(IPv6)', prop: 'ipv6', useSlot: true },
  { label: '状态', prop: 'statusText' },
  { label: 'vpc名称', prop: 'vpcName', isSkip: true },
  { label: 'vpc网段', prop: 'vpcCidr', isCopy: true },
  { label: '路由表', prop: 'routeTableName', isSkip: true },
  { label: '描述', prop: 'description', isEdit: true }
])

// 标签页组件
const tabs: any = { cloudHost, usedIp, virtualIp }
// tabs标签页
const tabControllers = ref([
  { label: '云主机', name: 'cloudHost' }
  // { label: '已用IP地址', name: 'usedIp' }
  // { label: '虚拟IP', name: 'virtualIp' }  (未做此功能，暂时屏蔽)
])
const activeName = ref('cloudHost')

const handleClick = (tab: any) => {
  if (tab.paneName === 'cloudHost') {
    queryDetail()
  }
}
// 详情
onMounted(() => {
  queryDetail()
})

const route = useRoute()
const cloudPlatformTypeCode = route.query?.cloudPlatformTypeCode as string //云类型
const cloudPlatformCategoryCode = route.query
  ?.cloudPlatformCategoryCode as string //云类别
const id = route.query?.id //子网Id
const vpcId = route.query?.vpcId //vpcId

//公共参数
const commonParams = () => {
  const { resourcePoolId, regionId, projectId } = detailInfo.value
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}
// 详情
const detailInfo: any = ref({})
const queryDetail = () => {
  querySubnetDetail({ id }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      data.statusText = RESOURCE_STATUS[data.status]
      detailInfo.value = data
    } else {
      detailInfo.value = {}
    }
  })
}

const editInfo = (val: any, config: any) => {
  updateSubnet(val, config, false)
}
//华为公有云
const isPublicHuawei = computed(
  () =>
    RegExp(/HUAWEI_CLOUD/).test(cloudPlatformTypeCode) &&
    RegExp(/PUBLIC/).test(cloudPlatformCategoryCode)
)
//更新子网接口
const updateSubnet = (val: any, config: any, ipv6_enable: boolean) => {
  const params: any = {
    vpcId,
    uuid: val.uuid,
    name: val.name,
    description: val.description,
    ...commonParams()
  }
  if (isPublicHuawei.value) {
    params.ipv6_enable = val.ipv6Enable
  }
  showLoading('更新中...')
  subnetEdit(params)
    .then((res: any) => {
      const { code, data, msg } = res
      if (code === 200) {
        ElMessage.success(data || '更新成功')
        config.showEdit = false
        queryDetail()
      } else {
        ElMessage.error(msg)
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}

const router = useRouter()
const toInstance = (val: string) => {
  const { vpcId, routeTableId } = detailInfo.value
  if (val === 'vpcName') {
    router.push({
      path: '/multi-cloud/vpc/detail',
      query: { id: vpcId, cloudPlatformTypeCode, cloudPlatformCategoryCode }
    })
  } else if (val === 'routeTableName') {
    router.push({
      path: '/multi-cloud/route-table/detail',
      query: {
        id: routeTableId,
        cloudType: cloudPlatformTypeCode,
        cloudCategory: cloudPlatformCategoryCode
      }
    })
  }
}

const enableIpv6 = () => {
  showDialog.value = true
  dialogType.value = 'openIpv6'
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  queryDetail()
}
</script>

<style scoped lang="scss">
.basic-info {
  width: 100%;
  .basic-info__head {
    width: calc(100% - 40px);
    padding: 20px;
    background-color: white;
    .basic-info__head-img {
      width: 25%;
      justify-content: center;
      align-items: center;
      .basic-info__head-img-box {
        width: 180px;
        height: 150px;
      }
      .basic-info__head-title {
        margin-top: 10px;
      }
    }
    // 修改分割线
    :deep(.el-divider--vertical) {
      height: auto;
      border-left: 2px var(--el-border-color) var(--el-border-style);
    }
    .basic-info__content {
      width: 75%;
      padding: 0 20px 0 10%;
    }
  }
  .basic-info__tabs {
    margin-top: 20px;
    background-color: white;
  }
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
