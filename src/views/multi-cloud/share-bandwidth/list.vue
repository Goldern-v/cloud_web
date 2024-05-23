<template>
  <div class="ideal-main-container share-bandwidth">
    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <el-button link type="primary" @click="clickDetail">{{
              props.row.name
            }}</el-button>

            <div class="flex-row">
              <div class="share-bandwidth-table-id">{{ props.row.uuid }}</div>
              <svg-icon icon="copy-icon" @click="clickCopy(props.row?.uuid)" />
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>

      <template #billingMode>
        <el-table-column label="计费模式" width="185" show-overflow-tooltip>
          <template #default="props">
            <div>{{ props.row.billingModeDes }}</div>
            <div>{{ props.row.createTime }}</div>
          </template>
        </el-table-column>
      </template>

      <template #ip>
        <el-table-column label="公网IP地址">
          <template #default="props">
            <el-text>{{ props.row.ip }}</el-text>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="225">
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
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, BillingEnum } from '@/utils/enum'
import { clickCopy, existPropWithArray } from '@/utils/tool'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建共享带宽',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '续费', prop: 'renew', disabled: true, disabledText: '请先选择' },
  {
    title: '转包年包月',
    prop: 'replace',
    disabled: true,
    disabledText: '请先选择'
  },
  { title: '导出', prop: 'export', disabled: true, disabledText: '请先选择' }
])
const router = useRouter()
type leftBtnType = string | number | object
const clickLeftEvent = (value: leftBtnType) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  } else if (value === 'renew') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.renew
  } else if (value === 'replace') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.replace
  }
}
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[0].disabled = true
    leftButtons.value[1].disabled = true
    leftButtons.value[2].disabled = true
    if (value?.length) {
      const onDemand = existPropWithArray(
        BillingEnum.ON_DEMAND,
        value,
        'billingMode'
      ) // 创建中
      const isPackage = existPropWithArray(
        BillingEnum.PACKAGE,
        value,
        'billingMode'
      )
      if (onDemand && isPackage) {
        leftButtons.value[0].disabled = true
        leftButtons.value[1].disabled = true
        leftButtons.value[0].disabledText = '按需计费不可以续订'
        leftButtons.value[1].disabledText = '包年包月不能转包年包月'
      } else {
        if (onDemand) {
          leftButtons.value[0].disabledText = '按需计费不可以续订'
          leftButtons.value[1].disabled = false
        } else {
          leftButtons.value[0].disabled = false
          leftButtons.value[1].disabled = true
          leftButtons.value[1].disabledText = '包年包月不能转包年包月'
        }
      }
      leftButtons.value[2].disabled = false
    }
  }
)

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  },
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {
  /* TODO document why this arrow function is empty */
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
]
state.dataList = [
  {
    name: 'esb-09a3',
    uuid: '98ab93e1-092d-f21a-c342-908d8be3',
    status: '正常',
    statusType: 'status-success',
    line: '普通带宽',
    size: 5,
    billingMode: 'ON_DEMAND',
    billingModeDes: '按需',
    billing: '按带宽计费',
    ip: '192.168.0.1',
    createTime: '2023-09-10 15:30:23'
  },
  {
    name: 'esb-19a3',
    uuid: '14ab93e1-092d-f21a-c342-908d8be3',
    status: '正常',
    statusType: 'status-success',
    line: '普通带宽',
    size: 5,
    billingMode: 'ON_DEMAND',
    billingModeDes: '按需',
    billing: '按带宽计费',
    ip: '192.168.0.1',
    createTime: '2023-09-10 15:30:23'
  },
  {
    name: 'esb-32a3',
    uuid: '402b93e1-092d-f21a-c342-908d8be3',
    status: '正常',
    statusType: 'status-success',
    line: '普通带宽',
    size: 5,
    billingMode: 'PACKAGE',
    billingModeDes: '包年包月',
    billing: '按带宽计费',
    ip: '192.168.0.1',
    createTime: '2023-09-10 15:30:23'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '线路', prop: 'line' },
  { label: '带宽(Mbit/s)', prop: 'size' },
  { label: '计费模式', prop: 'billingMode', useSlot: true },
  { label: '计费方式', prop: 'billing' },
  { label: '公网IP地址', prop: 'ip', useSlot: true }
]

const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改带宽', prop: 'change' },
  { title: '添加公网IP', prop: 'addEip' },
  { title: '移出公网IP', prop: 'removeEip' },
  { title: '转包年包月', prop: 'replace' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: object) => {
  rowData.value = row
  if (command === 'change') {
    router.push({ path: '/multi-cloud/share-bandwidth/change' })
  } else if (command === 'addEip') {
    showDialog.value = true
    dialogType.value = 'addEip'
  } else if (command === 'removeEip') {
    showDialog.value = true
    dialogType.value = 'removeEip'
  } else if (command === 'replace') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.replace
  }
}
const clickDetail = () => {
  router.push({ path: '/multi-cloud/share-bandwidth/detail' })
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
  rowData.value = null
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/share-bandwidth/create' })
  }
  showDialog.value = false
  rowData.value = null
}
</script>

<style scoped lang="scss">
.share-bandwidth {
  padding: $idealPadding;
  .share-bandwidth-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
