<template>
  <div class="ideal-main-container recycle-bin">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="名称"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280">
          <template #default="props">
            <div
              class="recycle-bin-table-title"
              @click="handleRedirectDetail()"
            >
              {{ props.row.name }}
            </div>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
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

      <template #ipAddress>
        <el-table-column label="IP地址" width="120" show-overflow-tooltip>
          <template #default="props">
            <ip-address
              :data-array="props.row.nicList"
              @mouseEnterPrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseLeavePrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseEnterPublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
              @mouseLeavePublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
            />
          </template>
        </el-table-column>
      </template>

      <template #spec>
        <el-table-column label="规格" show-overflow-tooltip>
          <template #default="props">
            <div v-if="props.row.flavor.uuid">{{ props.row.flavor.name }}</div>
            <div v-if="props.row.flavor.vcpus">
              {{ props.row.flavor.vcpus }}核｜{{ props.row.flavor.ram }}G
            </div>
          </template>
        </el-table-column>
      </template>

      <template #pay>
        <el-table-column label="付费/创建时间" width="150">
          <template #default="props">
            <div>{{ props.row.payMode }}</div>
            <div>{{ props.row.createTime.date }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="120" fixed="right">
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
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import ipAddress from '@/views/multi-cloud/cloud-host/components/ip-address.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { cloudHostUrl } from '@/api/java/compute'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudHostUrl,
  deleteUrl: '',
  queryForm: {
    status: 'RECYCLED'
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '镜像名称', prop: 'image.osVersion' },
  { label: 'IP地址', prop: 'ipAddress', useSlot: true },
  { label: '规格', prop: 'spec', useSlot: true },
  { label: '可用区', prop: 'availableZone' },
  { label: '付费', prop: 'pay', useSlot: true },
  { label: '到期时间', prop: 'expiredDate' },
  { label: '来源', prop: 'origin' }
]

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false // uuid拷贝
        item.statusText = RESOURCE_STATUS[item.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status]
        item.expiredDate = item.expiredTime?.date
          ? item.expiredTime?.date
          : '--'
      })
    }
  }
)
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '恢复', prop: 'recover' },
  { title: '销毁', prop: 'destroy' }
]
const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'recover') {
    dialogType.value = OperateEventEnum.recover
  } else if (command === 'destroy') {
    dialogType.value = OperateEventEnum.destroy
  }
  showDialog.value = true
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '批量销毁',
    prop: 'destroy',
    type: 'primary',
    icon: 'destroy-icon',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {}
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'download',
    icon: 'download-icon'
  },
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {}
const router = useRouter()

// 详情
const handleRedirectDetail = () => {
  router.push({ path: '/multi-cloud/cloud-host/detail' })
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  state.queryForm.status = 'RECYCLED'
  getDataList()
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.recycle-bin {
  padding: $idealPadding;
  .recycle-bin__search {
    align-items: center;
    justify-content: flex-start;
    .recycle-bin__time-range {
      margin-right: 10px;
    }
  }
  .recycle-bin-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .recycle-bin-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
