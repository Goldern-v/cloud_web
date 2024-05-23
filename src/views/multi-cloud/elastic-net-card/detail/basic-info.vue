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
      >
        <template #bindInstance>
          <div class="flex-row">
            <div class="ideal-theme-text">{{ detailInfo.bindInstance }}</div>
          </div>
        </template>
      </ideal-detail-info>
    </div>

    <div class="basic-info__content">
      <div class="flex-row basic-info__content-title">
        <el-divider direction="vertical" />
        <div>网络信息</div>
      </div>
      <ideal-detail-info
        :label-array="netLabel"
        :detail-info="detailInfo"
        class="basic-info__content"
      >
        <template #vpc>
          <el-text type="primary" @click="toVpc">{{
            detailInfo.vpcName
          }}</el-text>
        </template>
        <template #subnet>
          <el-text type="primary" @click="toSubnet">{{
            detailInfo.subnet?.name
          }}</el-text>
        </template>
        <template #service>
          <p>私网IP | {{ detailInfo.fixedIp }}</p>
          <p style="margin-right: 5px">
            弹性公网IP | {{ detailInfo.eip?.ipAddress || '--'
            }}<el-text
              v-if="detailInfo.eip?.ipAddress"
              type="primary"
              @click="clickUnbindEip"
              >解绑</el-text
            >
            <el-text v-else type="primary" @click="clickBindEip">绑定</el-text>
          </p>
        </template>
      </ideal-detail-info>
    </div>

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
import { queryNetCardDetail } from '@/api/java/network'
import { OperateEventEnum } from '@/utils/enum'
import dialogBox from '../dialog-box.vue'
import dayjs from 'dayjs'

const route = useRoute()
const routeData = JSON.parse(route.query.data as any)
// 详情label
const labelArray: any = ref([])
const mainNic = [
  { label: 'ID', prop: 'id', isCopy: true },
  { label: '类型', prop: 'type' },
  { label: '已绑定实例', prop: 'bindInstance', useSlot: true },
  { label: '流日志', prop: 'log' },
  { label: '创建时间', prop: 'createDate' }
]
const assistNic = [
  { label: 'ID', prop: 'id', isCopy: true },
  { label: 'VLAN', prop: '' },
  { label: '所属弹性网卡', prop: 'mainFixedIp', isSkip: true },
  { label: '创建时间', prop: 'createDate' },
  { label: '描述', prop: 'description' }
]
const netLabel = ref([
  { label: '所属VPC', prop: 'vpc', useSlot: true },
  { label: '所属子网', prop: 'subnet', useSlot: true },
  { label: '服务地址', prop: 'service', useSlot: true },
  { label: 'MAC地址', prop: 'macAddress' }
])
// 详情
const detailInfo: any = ref({})

const commonParams = () => {
  const params = {
    resourcePoolId: routeData.resourcePoolId,
    regionId: routeData.regionId,
    projectId: routeData.projectId
  }
  return params
}

onMounted(() => {
  if (routeData.type === 'MAIN_CARD') {
    labelArray.value = mainNic
  } else {
    labelArray.value = assistNic
  }
  queryNicInfo()
})
//弹性网卡详细信息
const queryNicInfo = () => {
  queryNetCardDetail({ id: routeData.id, ...commonParams() }).then(
    (res: any) => {
      const { data, code } = res
      if (code === 200) {
        data.createDate = dayjs(data.createTime?.date).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        detailInfo.value = data
      } else {
        detailInfo.value = {}
      }
    }
  )
}

const clickBindEip = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.bind
}

const clickUnbindEip = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.unbind
}

const router = useRouter()
//跳转时路由公共传参
const routeParams = {
  cloudPlatformTypeCode: routeData.cloudPlatformCategoryCode,
  cloudPlatformCategoryCode: routeData.cloudPlatformTypeCode
}
const toVpc = () => {
  router.push({
    path: '/multi-cloud/vpc/detail',
    query: { id: detailInfo.value.vpc?.id, ...routeParams }
  })
}

const toSubnet = () => {
  router.push({
    path: '/multi-cloud/subnet/detail',
    query: {
      id: detailInfo.value.subnet?.id,
      vpcId: detailInfo.value.vpc?.id,
      ...routeParams
    }
  })
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  queryNicInfo()
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
  .basic-info__content {
    margin-top: 20px;
    padding: 20px;
    width: calc(100% - 40px);
    background-color: white;
    :deep(.el-divider--vertical) {
      border-left: 2px var(--el-color-primary) solid;
    }
    .basic-info__content-title {
      justify-content: flex-start;
      align-items: center;
      background-color: $gray1-light;
      padding: 20px 10px;
      width: 100%;
    }
    :deep .ideal-detail-info-item {
      align-items: baseline;
    }
    p {
      line-height: 25px;
    }
    .el-text {
      cursor: pointer;
    }
  }
}
</style>
