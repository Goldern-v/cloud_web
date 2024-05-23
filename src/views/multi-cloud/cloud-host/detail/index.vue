<template>
  <div class="ideal-large-margin cloud-host-detail">
    <div class="cloud-host-detail__tabs">
      <div class="flex-row cloud-host-detail__header">
        <div class="flex-row cloud-host-detail-title">
          <el-divider direction="vertical" />
          <div>{{ detailData.name }}</div>
        </div>

        <ideal-button-events
          class="ideal-default-margin-right"
          :right-btns="attrData.rightButtons"
          :right-max-buttons="5"
          @clickRightEvent="clickRightEvent"
        >
        </ideal-button-events>
      </div>

      <el-divider />

      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabControllers"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </div>

    <component
      :is="tabs[activeName]"
      :detail-info="detailData"
      class="cloud-host-detail__component"
      @clickSuccessEvent="queryDetailData"
      @clickTabsEvent="clickTabsEvent"
    ></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './basic-info/index.vue'
import cloudDisk from './cloud-disk/list.vue'
import elasticIp from './elastic-ip/list.vue'
import monitor from './monitor/index.vue'
import netCard from './net-card/list.vue'
import safeGroup from './safe-group/list.vue'
import tag from './tag/list.vue'
import store from '@/store'
import type { IdealButtonEventProp } from '@/types'
import { ElMessageBox, ElMessage } from 'element-plus'
import { showLoading, hideLoading } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { existPropWithArray } from '@/utils/tool'
import { BillingEnum } from '@/utils/enum'
import {
  queryCloudHostDetail,
  cloudHostStart,
  cloudHostShutdown,
  cloudHostRestart
} from '@/api/java/compute'

// 标签页组件
const tabs: any = {
  basicInfo,
  cloudDisk,
  netCard,
  safeGroup,
  elasticIp,
  monitor,
  tag
}

const attrData = reactive({
  rightButtons: [] as IdealButtonEventProp[]
})
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    title: '远程登录',
    prop: 'create',
    type: 'primary',
    icon: 'telnet',
    iconColor: 'white'
  },
  { title: '开机', prop: 'powerOn', disabled: false },
  { title: '关机', prop: 'powerOff', disabled: false },
  { title: '重启', prop: 'reboot', disabled: false }
]
const route = useRoute()
const cloudCategory = route.query.cloudCategory
const cloudType = route.query.cloudType
onMounted(() => {
  handleRightEvent()
  queryDetailData()
  activeName.value = (route.query?.type as string) || 'basicInfo'
})
// 存放按钮,防止开关机操作后直接使用attrData.rightButtons时,按钮禁用情况不一致
const tempRightBtn = ref<IdealButtonEventProp[]>([])
// 不从云主机详情接口获取数据,防止接口请求失败
const handleRightEvent = () => {
  //华为私有云没有远程登录功能
  if (cloudCategory === 'PRIVATE' && cloudType === 'HUAWEI_CLOUD') {
    tempRightBtn.value = rightButtons.filter(item => item.prop !== 'create')
  } else {
    tempRightBtn.value = rightButtons
  }
  attrData.rightButtons = tempRightBtn.value
}
// 云主机uuid
const uuid = route.query.uuid
//查询云主机详情
const detailData: any = ref({})
const queryDetailData = () => {
  queryCloudHostDetail({ uuid })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        data.vpcName = data?.vpc?.name
        data.billMode =
          data.billType === BillingEnum.PACKAGE ? '包年包月' : '按需计费'
        data.spec = `${data?.flavor?.name} | ${data?.flavor?.vcpus}核 | ${data?.flavor?.ram}G`
        data.createDate = data?.createTime?.date
        data.statusIcon = RESOURCE_STATUS_ICON[data?.status]
        data.statusText = RESOURCE_STATUS[data?.status]
        data.privateIp = handleNicIp(data?.nicList)
        data.publicIp = handleNicIp(data?.nicList, 'public')
        detailData.value = data
        loopUpdateStatus()
      } else {
        detailData.value = {}
      }
    })
    .catch(_ => {})
}
// 处理私有ip
const handleNicIp = (arr: any[], type: string = 'private'): string => {
  let ip = ''
  let tempArr: any[] = []
  if (type === 'private') {
    tempArr = arr.map((item: any) => item?.fixedIp)
  } else {
    tempArr = arr.map((item: any) => item?.eip?.ipAddress)
  }
  ip = tempArr.join(',')
  return ip
}

//判断右上角操作是否可用
watch(
  () => detailData.value,
  value => {
    const existLoading = existPropWithArray(
      'loading',
      [detailData.value],
      'statusIcon'
    )
    const tempArr = JSON.parse(JSON.stringify(tempRightBtn.value))
    tempArr?.forEach((item: any) => {
      if (existLoading) {
        item.disabled = true
        item.disabledText = `当前云服务器正在${
          RESOURCE_STATUS[value.status]
        } 中不可操作`
      } else if (item.prop === 'powerOn' && value.status == 'RUNNING') {
        item.disabled = true
        item.disabledText = '当前云服务器运行中，不能再开机'
      } else if (
        (item.prop === 'powerOff' || item.prop === 'reboot') &&
        value.status === 'SHUTDOWN'
      ) {
        const tip = item.prop === 'powerOff' ? '关机' : '重启'
        item.disabled = true
        item.disabledText = `当前云服务器关机，不能再${tip}`
      }
    })
    attrData.rightButtons = tempArr
  },
  { deep: true }
)
// 轮询
const loopUpdateStatus = () => {
  let timer: number | undefined
  const existLoading = existPropWithArray(
    'loading',
    [detailData.value],
    'statusIcon'
  ) // 操作正在进行中

  if (existLoading) {
    timer = setTimeout(() => {
      queryDetailData()
    }, 5000)
  } else {
    if (timer) {
      clearTimeout(timer)
    }
  }
}

const clickRightEvent = (value: string | number | object) => {
  //云主机开关机，重启
  if (value === 'powerOn' || value === 'powerOff' || value === 'reboot') {
    const operateText: { [key: string]: any } = {
      powerOn: '开机',
      powerOff: '关机',
      reboot: '重启'
    }
    const operateUrl: any = {
      powerOn: cloudHostStart, //开机
      powerOff: cloudHostShutdown, //关机
      reboot: cloudHostRestart //重启
    }

    ElMessageBox.confirm(
      `确认要对当前主机进行${operateText[value]}操作吗？`,
      `${operateText[value]}`,
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      showLoading(`${operateText[value]}中...`)
      operateUrl[value]({ uuid })
        .then((res: any) => {
          const { msg, code, status, data, eventFlowId } = res
          if (code === 200 && status) {
            if (eventFlowId.length) {
              // 保存事件流id
              eventFlowId.forEach((item: string) => {
                store.resourceStore.eventFlow.push({ eventFlowId: item })
              })
            }
            ElMessage.success(data)
            queryDetailData()
          } else {
            ElMessage.error(msg || `${operateText[value]}失败`)
          }
          hideLoading()
        })
        .catch((_: any) => {
          hideLoading()
        })
    })
  }
}
// tabs标签页
const tabControllers = ref([
  { label: '基本信息', name: 'basicInfo' },
  { label: '云硬盘', name: 'cloudDisk' },
  { label: '弹性网卡', name: 'netCard' },
  { label: '安全组', name: 'safeGroup' },
  { label: '弹性公网IP', name: 'elasticIp' },
  { label: '监控', name: 'monitor' },
  { label: '标签', name: 'tag' }
])
const activeName = ref('basicInfo')

// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'basicInfo') {
    queryDetailData()
  }
})
const clickTabsEvent = (type: string) => {
  activeName.value = type
}
</script>

<style scoped lang="scss">
.cloud-host-detail {
  box-sizing: border-box;
  .cloud-host-detail__tabs {
    background-color: white;
    padding: 20px 20px 0;
    .cloud-host-detail__header {
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .cloud-host-detail-title {
        justify-content: flex-start;
        align-items: center;
        width: 100%;
      }
    }
    // 修改tabs底部边距
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
  .cloud-host-detail__component {
    margin-top: 20px;
  }

  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
