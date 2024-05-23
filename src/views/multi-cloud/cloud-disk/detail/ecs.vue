<template>
  <div class="ecs ideal-large-margin-top">
    <el-text
      >该磁盘已挂载至{{ dataArray.length }}个云服务器，还可以挂载至{{
        1 - dataArray.length
      }}个云服务器。</el-text
    >

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      ref="idealTableRef"
      :table-data="dataArray"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      :show-pagination="false"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称" show-overflow-tooltip>
          <template #default="props">
            <el-button
              link
              type="primary"
              class="ecs-font-size"
              @click="clickDetail(props.row)"
              >{{ props.row.name }}</el-button
            >
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="currentItem"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { cloudDiskDetail } from '@/api/java/store'

const route = useRoute()
const id = route.query.id
onMounted(() => {
  getDetail()
})
// 当前云硬盘信息
const currentItem = ref<any>({})
const dataArray = ref<any[]>([])
const getDetail = () => {
  cloudDiskDetail({ id })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        currentItem.value = data
        let instance: { [key: string]: any } = {}
        // 判断云硬盘是否有挂载云服务器
        if (data.hasOwnProperty('attachInstance') && data?.attachInstance) {
          instance = data.attachInstance
          instance.statusText = RESOURCE_STATUS[data.attachInstance?.status]
          instance.statusIcon =
            RESOURCE_STATUS_ICON[data.attachInstance?.status]
          const privateIPArray = data.attachInstance?.nicList.map(
            (item: any) => item.fixedIp
          )
          const publicIPArray = data.attachInstance?.nicList.map(
            (item: any) => item.eip.ipAddress
          )
          instance.privateIP = privateIPArray.join(',')
          instance.publicIP = publicIPArray.join(',')
          dataArray.value.push(instance)

          leftButtons.value[0].disabled = true
          leftButtons.value[0].type = 'default'
          leftButtons.value[0].disabledText = '云硬盘只能挂载一个云服务器。'
        }
      } else {
        dataArray.value = []
      }
    })
    .catch(_ => {
      dataArray.value = []
    })
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'ID', prop: 'uuid' },
  { label: '可用区', prop: 'availableZone' },
  { label: '设备标识', prop: 'deviceId', useSlot: true },
  { label: '私有IP地址', prop: 'privateIP' },
  { label: '弹性公网IP', prop: 'publicIP' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '查看监控指标', prop: 'monitor' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'monitor') {
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '挂载', prop: 'mount', type: 'primary' },
  {
    title: '卸载',
    prop: 'uninstall',
    disabled: true,
    disabledText: '请选择云服务器。'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'mount') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.mount
  } else if (value === 'uninstall') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.uninstall
  }
}
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[1].disabled = true
    leftButtons.value[1].disabledText = '请选择一个或者多个云服务器进行操作。'
    if (value?.length) {
      leftButtons.value[1].disabled = false

      const run = value.some((item: any) => item.status === 'running')
      // 存在运行状态
      if (run) {
        leftButtons.value[1].disabled = true
        leftButtons.value[1].disabledText =
          '只有当云服务器处于关机状态，才能执行此操作。'
      }
      // 华为私有云 底层限制：关机状态的云硬盘支持卸载
      const privateHuawei = value.some(
        (item: any) =>
          item?.status !== 'SHUTDOWN' &&
          RegExp(/HUAWEI/).test(item?.pool?.cloudType) &&
          RegExp(/PRIVATE/).test(item?.pool?.cloudCategory) &&
          !currentItem.value?.available
      )
      if (privateHuawei) {
        leftButtons.value[1].disabled = true
        leftButtons.value[1].disabledText =
          '挂载云主机只有关机状态，云硬盘才支持卸载。'
      }
    }
  }
)
const router = useRouter()
const clickDetail = (row: any) => {
  const data = JSON.stringify(row)
  router.push({
    path: '/multi-cloud/cloud-host/detail',
    query: { detail: data }
  })
}
const idealTableRef = ref()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
  idealTableRef.value.IdealTableList.clearSelection() // 清空多选
  getDetail()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = undefined // 防止再点击弹框时 有值
}
</script>

<style scoped lang="scss">
.ecs {
  background-color: white;
  padding: $idealPadding;
  .ecs-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
