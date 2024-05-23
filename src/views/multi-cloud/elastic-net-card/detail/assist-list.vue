<template>
  <div class="ideal-table-list__container assist-nic">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <el-divider />

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <el-collapse accordion>
      <el-collapse-item
        v-for="(item, index) of nicList"
        :key="index"
        :name="index"
      >
        <template #title>
          <div class="flex-row collapse-title" @click.stop>
            <span style="width: 200px; text-align: left">{{
              item.fixedIp
            }}</span>

            <ideal-button-events
              style="width: calc(100% - 200px)"
              :right-btns="rightButtons"
              :right-max-buttons="3"
              @clickRightEvent="clickRightEvent($event, item)"
            >
            </ideal-button-events>
          </div>
        </template>

        <div class="basic-info">
          <div class="basic-title">基本信息</div>
          <ideal-detail-info
            :label-array="basicInfoLabel"
            :detail-info="item"
            label-position="left"
          >
            <template #securityGroup>
              <el-text type="primary">
                {{ item.securityGroupName.join(' ,') }}
              </el-text>
            </template>
          </ideal-detail-info>
        </div>

        <div class="basic-info">
          <div class="basic-title">网络信息</div>
          <ideal-detail-info
            :label-array="netLabel"
            :detail-info="item"
            label-position="left"
          >
            <template #subnet>
              <el-text type="primary">{{ item.subnet?.name }}</el-text>
            </template>
            <template #service>
              <p>私网IP | {{ item.fixedIp }}</p>
              <p>
                <span>弹性公网IP | </span>
                <span v-if="item.eip?.ipAddress">
                  <el-text type="primary"> {{ item.eip?.ipAddress }}</el-text
                  ><span style="margin: 0 5px" class="ideal-tip-text"
                    >({{ item.eip?.name }})</span
                  >
                  <el-text type="primary" @click="clickUnbindEip(item)"
                    >解绑</el-text
                  >
                </span>
                <span v-else class="ideal-tip-text"
                  >--<el-text type="primary" @click="clickBindEip(item)"
                    >绑定</el-text
                  ></span
                >
              </p>
            </template>
          </ideal-detail-info>
        </div>
      </el-collapse-item>
    </el-collapse>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import type { IdealButtonEventProp, IdealSearch, IdealTextProp } from '@/types'
import { FiltrateEnum, OperateEventEnum } from '@/utils/enum'
import dialogBox from '../dialog-box.vue'
import { queryMainNicDetail } from '@/api/java/network'

const typeArray = ref<IdealSearch[]>([
  { label: '私有IP地址', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input }
])

const onClickSearch = () => {}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建辅助弹性网卡',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '迁移辅助弹性网卡',
    prop: 'transfer'
  }
])

const route = useRoute()
const routeData = JSON.parse(route.query.data as any)
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    rowData.value = { ...routeData }
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}

const rowData = ref({})
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  { title: '更改安全组', prop: 'changeSafeGroup', text: true, type: 'primary' },
  { title: '删除', prop: 'delete', text: true, type: 'primary' }
]
const clickRightEvent = (value: string | number | object, row: any) => {
  rowData.value = Object.assign(row, { mainFixedIp: routeData.fixedIp })
  if (value === 'changeSafeGroup') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.change
  } else if (value === 'delete') {
    showDialog.value = true
    dialogType.value = 'delete-assist-nic'
  }
}
const nicList = ref<any[]>([])

onMounted(() => {
  queryMainNicInfo()
})
const commonParams = {
  resourcePoolId: routeData.resourcePoolId,
  regionId: routeData.regionId,
  projectId: routeData.projectId
}
const queryMainNicInfo = () => {
  const params = {
    ...commonParams,
    uuid: routeData.uuid
  }
  queryMainNicDetail(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      data.forEach((ele: any) => {
        ele.securityGroupName = ele.securityGroups.map((item: any) => item.name)
      })
      nicList.value = data
    } else {
      nicList.value = []
    }
  })
}
const basicInfoLabel = [
  { label: 'ID', prop: 'id', isCopy: true },
  { label: 'VLAN', prop: '' },
  { label: '创建时间', prop: 'createDate' },
  { label: '安全组', prop: 'securityGroup', useSlot: true }
]

const netLabel = [
  { label: '所属VPC', prop: 'vpcName', isSkip: true },
  { label: '所属子网', prop: 'subnet', useSlot: true },
  { label: '服务地址', prop: 'service', useSlot: true },
  { label: 'MAC地址', prop: 'macAddress' }
]

const clickBindEip = (item: any) => {
  rowData.value = item
  showDialog.value = true
  dialogType.value = OperateEventEnum.bind
}

const clickUnbindEip = (item: any) => {
  rowData.value = item
  showDialog.value = true
  dialogType.value = OperateEventEnum.unbind
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  queryMainNicInfo()
}
</script>

<style scoped lang="scss">
.assist-nic {
  padding: 20px;
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
    border-radius: 5px;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
    border-radius: 5px;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: 5px;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
  .basic-title {
    font-size: 14px;
    color: var(--el-text-color-primary);
    font-weight: bolder;
    padding-left: 20px;
  }
  :deep .ideal-detail-info-item {
    align-items: baseline;
  }
}
</style>
