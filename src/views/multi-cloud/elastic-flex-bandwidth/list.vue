<template>
  <div class="ideal-main-container flex-bandwidth">
    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
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
            <el-button link type="primary" class="flex-bandwidth-font-size" @click="clickDetail">{{ props.row.name }}</el-button>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" >
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>

      <template #resource>
        <el-table-column label="伸缩资源">
          <template #default="props">
            <div class="flex-bandwidth-font-size">{{ props.row.resource }}</div>
            <div class="ideal-theme-text flex-bandwidth-font-size">{{ props.row.ip }}</div>
          </template>
        </el-table-column>
      </template>

      <template #trigger>
        <el-table-column label="触发条件">
          <template #default="props">
            <div class="flex-bandwidth-font-size">{{ props.row.trigger }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
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
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]
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
state.dataList = [
  {
    name: 'as-policy-5309',
    uuid: 'e916a919-9dae-439f-a24a-becdfa7ab9ce',
    status: '已启用',
    statusStr: 'using',
    statusType: 'status-success',
    resource: '弹性公网IP',
    ip: '1.94.54.201',
    type: '告警策略',
    trigger: '入网带宽最大值>1bit/s。连续满足1次后触发。监控周期5分钟。只告警一次。',
    execute: '设置为1Mbit/s',
    coolingTime: 300
  }
]
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false // uuid拷贝
      })
    }
  }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '伸缩资源', prop: 'resource', useSlot: true },
  { label: '策略类型', prop: 'type' },
  { label: '触发条件', prop: 'trigger', useSlot: true },
  { label: '执行动作', prop: 'execute' },
  { label: '冷却时间(秒)', prop: 'coolingTime' }
]
// 行数据
const rowData = ref()
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '停用', prop: 'forbidden' },
  { title: '立即执行', prop: 'immediate' },
  { title: '修改', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'forbidden') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.forbidden
  } else if (command === 'immediate') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.immediate
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建伸缩带宽策略',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '请选择需要删除的伸缩带宽' },
  { title: '导出', prop: 'export' }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({ path: '/multi-cloud/elastic-flex-bandwidth/create' })
  }
}
watch(() => state.dataListSelections, value => {
  leftButtons.value[1].disabled = true
  leftButtons.value[1].disabledText = '请选择需要删除的伸缩带宽'
  if (value?.length) {
    leftButtons.value[1].disabled = false
  }
})
const clickDetail = () => {
  router.push({ path: '/multi-cloud/elastic-flex-bandwidth/detail' })
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = undefined // 防止再点击弹框时 有值
  rowData.value = null
}
</script>

<style scoped lang="scss">
.flex-bandwidth {
  padding: $idealPadding;
  .flex-bandwidth-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
