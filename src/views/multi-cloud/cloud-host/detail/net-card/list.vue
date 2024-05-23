<template>
  <div class="elastic-card">
    <div class="ideal-tip-text">
      新的扩展网卡在添加成功后，需要在弹性云服务器内部配置策略路由来实现扩展网卡的通信。
      <span class="ideal-theme-text">如何配置策略路由？</span>
    </div>

    <div class="ideal-tip-text">
      绑定弹性网卡、解绑弹性网卡或切换VPC后，建议您
      <span class="ideal-theme-text">设置网卡多队列</span>
      以提升网络性能。
    </div>

    <!-- <ideal-select-search
      class="ideal-default-margin-top"
      :search-type="SearchTypeEnum.title"
      prefix-title="名称"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search> -->

    <el-divider />

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <el-collapse accordion>
      <el-collapse-item v-for="(item,index) of nicList" :key="index" :name="index">
        <template #title>
          <div class="flex-row collapse-title" style="width: 100%" @click.stop>
            <span style="width: 500px;text-align: left;">{{ item.fixedIp }} | {{ item.ipAddress }}</span>

            <ideal-button-events
              style="width: calc(100% - 500px)"
              :right-btns="rightButtons"
              :right-max-buttons="5"
              @clickRightEvent="clickRightEvent"
            >
            </ideal-button-events>
          </div>
        </template>

        <ideal-detail-info
          :label-array="diskArray"
          :detail-info="item"
          label-position="left"
        >
          <template #status>
            <ideal-status-icon
              v-if="item.status"
              :status-icon="item.statusIcon"
              :status-text="item.statusText"
            />
          </template>

          <template #safeGroup>
            <div>{{ item.safeGroup }}</div>
          </template>
        </ideal-detail-info>
      </el-collapse-item>
    </el-collapse>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :detail="detailInfo"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import type { IdealButtonEventProp, IdealTextProp } from '@/types'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { cloudHostNicDetail } from '@/api/java/compute'

interface DetailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  detailInfo: () => ({})
})

onMounted(() => {
  getNicDetail()
})
const nicList = ref<any[]>([])
const getNicDetail = () => {
  const params = {
    instanceUuid: props.detailInfo.uuid
  }
  cloudHostNicDetail(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      nicList.value = data.map((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
        item.safeGroup = item?.securityGroupName.join(',')
        item.name = item?.name ? item.name : '--'
        item.bandwidthSize = item?.bandwidthSize ? item.bandwidthSize : '--'
        item.neutronSubnetId = item?.neutronSubnetId ? item.neutronSubnetId : '--'
        return item
      })
    } else {
      nicList.value = []
    }
  }).catch(_ => {
    nicList.value = []
  })
}

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '绑定弹性网卡',
    prop: 'bind',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    disabled: true,
    disabledText: '暂不支持'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'bind') {
    clickBind()
  }
}

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  { title: '切换VPC', prop: 'replace', text: true, type: 'primary', disabled: true, disabledText: '暂不支持' },
  { title: '修改私有IP', prop: 'changeIp', text: true, type: 'primary', disabled: true, disabledText: '暂不支持' },
  { title: '管理虚拟IP地址', prop: 'manageIp', text: true, type: 'primary', disabled: true, disabledText: '暂不支持' },
  { title: '更改安全组', prop: 'changeSafeGroup', text: true, type: 'primary' },
  { title: '加入安全组', prop: 'addSafeGroup', text: true, type: 'info' },
  { title: '移出安全组', prop: 'removeSafeGroup', text: true, type: 'info' },
  { title: '解绑', prop: 'unbind', text: true, type: 'info', disabled: true, disabledText: '暂不支持' }
]
const clickRightEvent = (value: string | number | object) => {
  if (value === 'changeSafeGroup') {
    showDialog.value = true
    dialogType.value = 'changeSafeGroup'
  } else if (value === 'addSafeGroup') {
    showDialog.value = true
    dialogType.value = 'addSafeGroup'
  } else if (value === 'removeSafeGroup') {
    showDialog.value = true
    dialogType.value = 'removeSafeGroup'
  } else if (value === 'unbind') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.unbind
  }
}
// 云硬盘信息
const diskArray = ref<any[]>([
  { label: '名称', prop: 'name' },
  { label: '子网', prop: 'subnetName' },
  { label: '网卡UUID', prop: 'nicUuid' },
  { label: '网络ID', prop: 'networkUuid' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '私有IP地址', prop: 'fixedIp' },
  { label: '安全组', prop: 'safeGroup', useSlot: true },
  { label: 'MAC地址', prop: 'macAddress' },
  { label: '带宽大小', prop: 'bandwidthSize' },
  { label: 'IPv4子网ID', prop: 'neutronSubnetId' },
])

// 搜索
const clickSearch = (search: string, type: string) => {

}
// 重置
const clickReset = () => {

}
const clickBind = () => {
  dialogType.value = OperateEventEnum.bind
  showDialog.value = true
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getNicDetail()
}
</script>

<style scoped lang="scss">
.elastic-card {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: white;
  .collapse-title {
    flex: 1;
    order: 1;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: var(--el-color-primary-light-9);
    border-top: none;
    border-bottom: none;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: $circleRadiusSize;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
  // 修改描述列表
  :deep(.el-descriptions__label:not(.is-bordered-label) ) {
    color: #8B8B8B;
    font-size: 14px;
  }
  :deep(.el-descriptions__content:not(.is-bordered-label)) {
    color: #000;
    font-size: 14px;
  }
  :deep(.ideal-button-events__container .more-button .el-button--primary) {
    --el-button-bg-color: transparent;
    --el-button-border-color: transparent;
    --el-button-text-color: var(--el-color-primary);
    --el-button-hover-text-color: var(--el-color-primary);
  }
  :deep(.ideal-button-events__container .more-button .el-button--primary:hover) {
    --el-button-text-color: var(--el-color-primary);
    background-color: transparent;
    border-color: transparent;
  }
  :deep(.ideal-button-events__container .more-button .el-button--primary:focus) {
    --el-button-text-color: var(--el-color-primary);
    background-color: transparent;
    border-color: transparent;
  }
}
</style>
